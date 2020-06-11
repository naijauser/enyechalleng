import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import RoomIcon from '@material-ui/icons/Room';
import GradeRoundedIcon from '@material-ui/icons/GradeRounded';
import FiberManualRecordRoundedIcon from '@material-ui/icons/FiberManualRecordRounded';
import DirectionsIcon from '@material-ui/icons/Directions';
import { getDistance } from 'geolib';


const useStyles = makeStyles({
  root: {
    minWidth: 275,
    borderRadius: '20px',
    margin: '30px 0', 
    backgroundColor: '#FCFCFC'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    fontSize: '0.8rem'
  },
  details: {
    display: 'flex',
    padding: '0 3px',
    marginBottom: 8,
  }, 
  hospName: {
    marginLeft: '10px',
    marginBottom: '10px'
  },
  room: {
    color: '#69DDFF',
    marginRight: '10px'
  },
  open: {
    color: '#5FAD56',
    marginRight: '10px'
  },
  closed: {
    color: '#CD5334',
    marginRight: '10px'
  },
  direc: {
    color: '#1C2826',
    marginRight: '10px'
  }, 
  stars: {
    color: '#F3C969',
    marginRight: '7px'
  }, 
  starTxt: {
    fontSize: '0.8rem'
  }, 
  flexPlease: {
    display: 'flex'
  }
});

interface ListData {
  name?: string;
  formatted_address?: string;
  opening_hours?: {
    open_now?: boolean;
  }, 
  geometry?: {
    location?: {
      lat?: number;
      lng?: number
    }
  }, 
  rating?: number
}

interface ListProp {
  listData?: ListData;
  coordinates?: {
    hLat?: number,
    hLong?: number,
  }
}

export const ListItem = (data: ListProp ) => {
  const classes = useStyles();

  let distance = 0

  useEffect(() => {
    
    const hospitalLat = data?.listData?.geometry?.location?.lng;
    const hospitalLong = data?.listData?.geometry?.location?.lng;

    const userLat = data.coordinates?.hLat;
    const userLong = data.coordinates?.hLong;

    distance = getDistance(
      {
        latitude: hospitalLat ? hospitalLat : 0,
        longitude: hospitalLong ? hospitalLong : 0
      }, 
      {
        latitude: userLat ? userLat : 0, 
        longitude: userLong ? userLong : 0
      }
    );

    distance = parseInt((distance/1000).toFixed(2));

  })

  return (
    <Paper className={classes.root} >
      <CardContent>
        <Typography className={classes.hospName} variant="h5" component="h5">
          {data?.listData?.name}
        </Typography>
        <div className={classes.details}>
          <RoomIcon className={classes.room} />
          <Typography className={classes.pos} color="textSecondary">
            {data?.listData?.formatted_address}
          </Typography>
        </div>

        <div className={classes.details}>
          {data?.listData?.opening_hours?.open_now ?
            (<div className={classes.flexPlease}><FiberManualRecordRoundedIcon className={classes.open} />
              <Typography className={classes.pos} color="textSecondary">
                Open
              </Typography></div>) :
            (<div className={classes.flexPlease}><FiberManualRecordRoundedIcon className={classes.closed} />
              <Typography className={classes.pos} color="textSecondary">
                Closed
              </Typography></div>)
          }
        </div>

        <div className={classes.details}>
          <DirectionsIcon className={classes.direc} />
          <Typography className={classes.pos} color="textSecondary">
            { distance } kilometers away.
          </Typography>
        </div>

      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <GradeRoundedIcon className={classes.stars} />
          <span className={classes.starTxt}>{data?.listData?.rating}</span>
        </IconButton>
      </CardActions>
    </Paper>
  )
}
