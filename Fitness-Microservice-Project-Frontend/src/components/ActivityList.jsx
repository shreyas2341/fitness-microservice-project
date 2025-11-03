import { Card, CardContent, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getActivities } from '../services/api';

const ActivityList = ({ refreshKey }) => {
  const [activities, setActivities] = useState([]);
  const navigate = useNavigate();

  const fetchActivities = async () => {
    try{
        const response = await getActivities();
        setActivities(response.data);
    }
    catch(error){
        console.error(error);
    }
  }
    useEffect(() => {
        fetchActivities();
    }, [refreshKey])
  return (
    <Grid container spacing={3} className="fade-in">
        {activities.map((activity) => (
            <Grid item xs={12} sm={6} md={4} key={activity.id}>
                <Card 
                    sx={{
                        cursor: 'pointer',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                    }}
                    onClick={() => navigate(`/activities/${activity.id}`)}
                >
                    <CardContent>
                        <Typography variant='h6' gutterBottom>
                            {activity.customType && activity.customType.trim() !== ''
                                ? activity.customType
                                : (activity.type === 'RUNNING' ? '🏃 Running' :
                                   activity.type === 'WALKING' ? '🚶 Walking' :
                                   activity.type === 'CYCLING' ? '🚲 Cycling' :
                                   activity.type === 'SWIMMING' ? '🏊 Swimming' :
                                   activity.type === 'WEIGHT_TRAINING' ? '🏋️ Weight Training' :
                                   activity.type === 'YOGA' ? '🧘 Yoga' :
                                   activity.type === 'HIIT' ? '🔥 HIIT' :
                                   activity.type === 'CARDIO' ? '💓 Cardio' :
                                   activity.type === 'STRETCHING' ? '🤸 Stretching' :
                                   activity.type === 'OTHER' ? 'Other' : activity.type)}
                        </Typography>
                        <div className="activity-stat">
                            <Typography>⏱️ {activity.duration}</Typography>
                        </div>
                        <div className="activity-stat">
                            <Typography>🔥 {activity.caloriesBurned} cal</Typography>
                        </div>
                    </CardContent>
                </Card>
            </Grid>
        ))}
    </Grid>
  )
}

export default ActivityList