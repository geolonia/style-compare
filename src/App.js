import './App.css';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { IosShare, Crop } from '@mui/icons-material';
import logo from './logo.svg';


function App() {

  let url = new URL(window.location.href);
  const commitQuery = url.searchParams.get('commit');

  const mapNodeBefore = useRef(null);
  const mapNodeAfter = useRef(null);
  const mapNodeCompare = useRef(null);
  const [commits, setCommits] = useState(null);
  const [currentCommit, setCurrentCommit] = React.useState(commitQuery ? commitQuery : '');
  const [beforeMapObject, setBeforeMapObject] = React.useState(null)
  const [commitUrl, setCommitUrl] = React.useState('');
  const [commitDate, setCommitDate] = React.useState(null);
  const [displayOverlay, setDisplayOverlay] = React.useState(false);


  useEffect(() => {
    if (commitQuery && commits) {
      setCurrentCommit(commitQuery);
      const thisCommit = commits.find(commit => commit.sha === commitQuery);
      setCommitUrl(thisCommit.html_url);
      setCommitDate(thisCommit.commit.committer.date);
    }
  },[commitQuery, commits])


  const handleChange = (event) => {

    const thisCommit = commits.find(commit => commit.sha === event.target.value);

    setCommitUrl(thisCommit.html_url);
    setCurrentCommit(event.target.value);
    setCommitDate(thisCommit.commit.committer.date);

    url.searchParams.delete('commit');
    url.searchParams.append('commit', event.target.value);
    window.location.href = url;
  };

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.github.com/repos/geoloniamaps/basic/commits?sha=gh-pages&since=2022-01-11T00:00:00Z&per_page=100');
        setCommits(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData()

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

    new geolonia.Compare(beforeMap, afterMap, mapNodeCompare.current, {});

    beforeMap.on('load', () => {
      setBeforeMapObject(beforeMap)
    })

  }, [])

  useEffect(() => {

    if (beforeMapObject && currentCommit) {
      beforeMapObject.setStyle(`https://raw.githubusercontent.com/geoloniamaps/basic/${currentCommit}/style.json`)
    }

  }, [beforeMapObject, currentCommit])

  return (
    <>
      <div className='header'>
        <div className='brand'>
          <img id="logo" src={logo} alt='Geolonia' />
          <h1>Style Compare</h1>
        </div>
        <div className='header-utils'>
          <Button
            variant={displayOverlay ? "contained" : "outlined"}
            endIcon={<Crop />}
            onClick={() => {
              setDisplayOverlay(!displayOverlay)
            }}
          >
            ????????????????????????????????????
          </Button>
        </div>
      </div>
      {
        displayOverlay && 
        <div className="style-compare-overlay-container">
          <div className="style-compare-overlay"></div>
        </div>
      }
      <div
        style={{
          position: "absolute",
          margin: "20px",
          height: " 60px",
          width: "580px"
        }}
      >
        <FormControl
          fullWidth
          style={{
            position: "absolute",
            zIndex: 2,
            width: "250px",
            backgroundColor: "#ffffff",
          }}
        >
          <InputLabel id="style-select-label">????????????????????????</InputLabel>
          <Select
            labelId="style-select-label"
            id="style-select"
            value={currentCommit}
            label="????????????????????????"
            onChange={handleChange}
          >
            {commits && commits.map((commit, i) => {
              
              return (
                <MenuItem
                  key={commit.sha}
                  value={commit.sha}
                  style={{
                    padding: "20px 20px"
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "end"
                    }}
                  >
                    <p
                      style={{
                        margin: "0",
                        marginRight: "15px"
                      }}
                    >
                      {`ver.${commits.length - (i+1)}: ${new Date(commit.commit.committer.date).toLocaleString('ja-JP')}`}
                    </p>
                  </div>
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
        <a
          href={commitUrl}
          target='_blank'
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            zIndex: 2,
            right: "160px",
            top: "7px",
            backgroundColor: "#ffffff",
            padding: "10px"
          }}
        >
          <IconButton
            color="primary"
            style={{
              fontSize: "20px",
              margin: "0",
              padding: "0",
            }}
          >
            <span style={{ fontSize: "12px" }}>???????????????????????????</span><IosShare />
          </IconButton>
        </a>
        <a
          href={commitDate && `https://github.com/geoloniamaps/basic/pulls?q=merged%3A${commitDate.slice(0, 10)}`}
          target='_blank'
          rel="noopener noreferrer"
          style={{
            position: "absolute",
            zIndex: 2,
            right: 0,
            top: "7px",
            backgroundColor: "#ffffff",
            padding: "10px"
          }}
        >
          <IconButton
            color="primary"
            style={{
              fontSize: "20px",
              margin: "0",
              padding: "0",
            }}
          >
            <span style={{ fontSize: "12px" }}>????????????PR?????????</span><IosShare />
          </IconButton>
        </a>
      </div>
      <div
        style={{
          position: "absolute",
          right: " 50px",
          zIndex: 2,
          width: "230px",
          backgroundColor: "rgb(255, 255, 255)",
          margin: "20px",
          padding: "16.5px 14px",
          fontSize: "16px",
          border: "1px solid rgba(0, 0, 0, 0.23)",
          borderRadius: "4px",
        }}
      >
        <label
          className="label-title"
          data-shrink="true"
          style={{
            backgroundColor: "#ffffff"
          }}
        >?????????</label>
        {commits && `ver.${commits.length -1}: ${new Date(commits[0].commit.committer.date).toLocaleString('ja-JP')}`}
      </div>
      <div ref={mapNodeCompare} id="comparison-container">
        <div ref={mapNodeBefore} id="before" className="map"></div>
        <div ref={mapNodeAfter} id="after" className="map"></div>
      </div>
    </>
  );
}

export default App;
