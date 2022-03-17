import './App.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function App() {

  const mapNodeBefore = useRef(null);
  const mapNodeAfter = useRef(null);
  const mapNodeCompare = useRef(null);
  const [commits, setCommits] = useState(null);
  const [currentCommit, setCurrentCommit] = React.useState('');
  const [ beforeMapObject, setBeforeMapObject ] = React.useState(null)

  const handleChange = (event) => {
    setCurrentCommit(event.target.value);
  };

  useEffect(async () => {
    try {
      const response = await axios.get('https://api.github.com/repos/geoloniamaps/basic/commits?sha=gh-pages&since=2022-01-11T00:00:00Z&per_page=100');
      setCommits(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [])

  useEffect(() => {

    // @ts-ignore
    const { geolonia } = window;

    const beforeMap = new geolonia.Map({
      container: mapNodeBefore.current,
      style: 'geolonia/basic',
      hash: true,
      center: [139.7648345, 35.6798619],
      zoom: 14
    });

    const afterMap = new geolonia.Map({
      container: mapNodeAfter.current,
      style: 'geolonia/basic',
      hash: true,
      center: [139.7648345, 35.6798619],
      zoom: 14
    });

    const map = new geolonia.Compare(beforeMap, afterMap, mapNodeCompare.current, {
      // Set this to enable comparing two maps by mouse movement:
      // mousemove: true
    });

    beforeMap.on('load', () => {
      setBeforeMapObject(beforeMap)
    })

  }, [])

  useEffect(() => {

    if (beforeMapObject && currentCommit) {
      beforeMapObject.setStyle(`https://raw.githubusercontent.com/geoloniamaps/basic/${currentCommit}/style.json`)
    }

  },[currentCommit])

  return (
    <>
      <FormControl
        fullWidth
        style={{
          position: "absolute",
          zIndex: 2,
          width: "230px",
          backgroundColor: "#ffffff",
          margin: "20px"
        }}
      >
        <InputLabel id="demo-simple-select-label">スタイル更新履歴</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentCommit}
          label="スタイル更新履歴"
          onChange={handleChange}
        >
          {commits && commits.map((commit, i) => {
            return <MenuItem key={commit.sha} value={commit.sha}>{`ver.${commits.length - i }: ${new Date(commit.commit.committer.date).toLocaleString('ja-JP')}`}</MenuItem>
          })}
        </Select>
      </FormControl>
      <div
        style={{
          position: "absolute",
          right:" 50px",
          zIndex: 2,
          width: "230px",
          backgroundColor: "rgb(255, 255, 255)",
          margin: "20px",
          padding: "16.5px 14px",
          fontSize: "16px",
          border: "1px solid rgb(133, 133, 133)"
        }}
      >最新版</div>
      <div ref={mapNodeCompare} id="comparison-container">
        <div ref={mapNodeBefore} id="before" className="map"></div>
        <div ref={mapNodeAfter} id="after" className="map"></div>
      </div>
    </>
  );
}

export default App;
