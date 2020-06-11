import React, { Props, useEffect, useState, FC } from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { ListItem } from './ListItem';
import { Paper, IconButton, InputBase, Divider, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';
import { hospitalData } from '../models/data'
import Blank from '../blank.svg';
import Location from '../location.svg';
import None from '../not-found.svg';
import { useSearch } from './useSearch'



const useStyles = makeStyles((theme: Theme) => 
  createStyles({
    topDiv: {
      marginTop: '70px',
      padding: '0 10%', 
      [theme.breakpoints.up('md')]: {
        padding: '0 20%'
      }
    },
    root: {
      flexGrow: 1,
    }, 
    searchRoot: {
      marginTop: '10px',
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    blankImg: {
      width: '100%', 
      height: '50vh', 
      marginTop: '3rem'
    },
    blankImgIntro: {
      width: '100%', 
      height: '50vh',
      marginTop: '1rem'
    },
    blankIntro: {
      textAlign: 'center', 
      marginTop: '10px'
    }, 
    blank: {
      textAlign: 'center', 
      paddingTop: '40px'
    }, 
    rider: {
      fontSize: '1rem', 
    }
  })
);

export const Search: FC = () => {

  const classes = useStyles();

  // State to store search parameter
  const [ searchParams, setSearchParams] = useState<string>('');

  // State to store loading state
  const [ isLoading, setLoadingStatus ] = useState<boolean>(false);

  // State to store search radius
  const [ searchRadius, SetSearchRadius ] = useState<number>(1);

  // State to store search results
  const [ plData, setLocData] = useSearch(searchParams, searchRadius, {});


  useEffect(() => {
    setLoadingStatus(false);
    
  }, [plData]);

  const runSearch = () => {
    setLoadingStatus(true);
    setLocData('');
  }

  return (
    <div className={classes.topDiv}>


      <Paper component="form" className={classes.searchRoot}>
        <InputBase
          type="text"
          className={classes.input}
          placeholder="Search For Hospitals"
          value={searchParams}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              setSearchParams(e.currentTarget.value);
              runSearch();
            }
          }
        />
        <FormControl >
          <InputLabel id="demo-simple-select-helper-label"></InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            type="number"
            value={searchRadius}
            onChange={(e: React.ChangeEvent<{ value: unknown }>): void => {
                SetSearchRadius(e.target.value as number );
                runSearch();
              }
            }
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>1 km</MenuItem>
            <MenuItem value={5}>5 km</MenuItem>
            <MenuItem value={10}>10 km</MenuItem>
            <MenuItem value={20}>20 km</MenuItem>
            <MenuItem value={50}>50 km</MenuItem>
            <MenuItem value={100}>100 km</MenuItem>
          </Select>
          <FormHelperText>Set Search radius</FormHelperText>
        </FormControl>
        <IconButton 
          type="submit" 
          className={classes.iconButton} 
          aria-label="search"
          onClick={(e) => {
            runSearch()
            e.preventDefault();
          }}
        >
            <SearchIcon />
        </IconButton>
      </Paper>

      {    
        isLoading ? (<div>
          <Box pt={5}>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </Box>

            <Box pt={5}>
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </Box>
          </div>) :

        (() => {
          switch (plData.state) {
            case 'isLoading':
              return <div>
                <Box pt={5}>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </Box>

                  <Box pt={5}>
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                  </Box>
                </div>;

            case 'noLocation':
              return <Grid className={classes.blank} >
                <Typography variant="h5" component="h5" color="textSecondary">
                  Please ensure location is enabled on your device!
                </Typography>
                <img className={classes.blankImg} src={Location}/>
              </Grid>;

            case 'noData': 
              return <Grid className={classes.blank} >
                <Typography variant="h5" component="h5" color="textSecondary">
                  No Hospitals found in your vicinity.
                </Typography>
                <img className={classes.blankImg} src={None}/>
              </Grid>;

            case 'result': 
              const coord = plData.coordinates;
              const results = plData.place_data;
              
              return results?.map((item: object) => 
                <ListItem key={ `${Math.random().toString(36).substring(2, 15) + 
                        Math.random().toString(36).substring(2, 15)}` } 
                        listData={ item } 
                        coordinates={ coord }
                />)

            default: 
              return <Grid className={classes.blankIntro} >
                <Typography variant="h2" component="h2" color="textSecondary">
                  RAEDER
                </Typography>
                <Typography className={classes.rider} variant="h5" component="h5" color="textSecondary">
                  Find Hospitals near you 
                </Typography>
                <img className={classes.blankImgIntro} src={Blank}/>
              </Grid>;
          }
        })()
      }
    </div>
  );
}

export default () =>  {
  return (
    <Box overflow="hidden">
      <Search />
    </Box>
  );
}
