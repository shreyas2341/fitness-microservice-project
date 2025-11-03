import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getActivityDetail, getActivityRecommendation } from '../services/api';
import { Box, Card, CardContent, Divider, Typography, CircularProgress, Button } from '@mui/material';

const ActivityDetail = () => {
  const {id} = useParams();
  const [activity, setActivity] = useState(null);
  const [recommendation, setRecommendation] = useState(null);

    // Debug: log activity and recommendation shapes so we can inspect API responses
    useEffect(() => {
        console.log('ActivityDetail data update:', { activity, recommendation });
    }, [activity, recommendation]);

  useEffect(() => {
            let mounted = true;
            let pollInterval = null;
            let startedPolling = false;

            const startPolling = () => {
                if (startedPolling) return;
                startedPolling = true;
                console.log('Starting to poll for recommendations...');
                
                pollInterval = setInterval(async () => {
                    try {
                        console.log('Polling for recommendation...');
                        const r = await getActivityRecommendation(id);
                        
                        if (!mounted) {
                            console.log('Component unmounted, stopping poll');
                            return;
                        }
                        
                        if (r.data) {
                            // Store the full recommendation document so arrays (improvements/suggestions/safety) are available
                            console.log('Received recommendation payload:', r.data);
                            setRecommendation(r.data);
                            clearInterval(pollInterval);
                            pollInterval = null;
                        } else {
                            console.log('No recommendation yet, continuing to poll...');
                        }
                    } catch (e) {
                        console.error('Polling failed:', e);
                    }
                }, 3000);
            };

            const fetchData = async () => {
                try {
                    console.log('Fetching activity details for ID:', id);
                    // First fetch activity details
                    const activityResponse = await getActivityDetail(id);
                    console.log('Activity data received:', activityResponse.data);
                    
                    if (!mounted) {
                        console.log('Component unmounted during activity fetch');
                        return;
                    }
                    setActivity(activityResponse.data);
                    
                    // Then check for recommendation
                    try {
                        console.log('Checking for existing recommendation');
                        const recommendationResponse = await getActivityRecommendation(id);
                        if (recommendationResponse.data) {
                            console.log('Recommendation already available (payload):', recommendationResponse.data);
                            setRecommendation(recommendationResponse.data);
                        } else {
                            console.log('No recommendation yet, will start polling');
                            startPolling(); // Start polling only for recommendation
                        }
                    } catch (recError) {
                        console.error('Initial recommendation fetch failed:', recError);
                        startPolling();
                    }
                } catch (error) {
                    console.error('Activity fetch failed:', error);
                }
            };

            // Only call fetchData once
            fetchData();

            // Cleanup function
            return () => {
                console.log('Running cleanup for activity detail');
                mounted = false;
                if (pollInterval) {
                    console.log('Cleaning up polling interval');
                    clearInterval(pollInterval);
                }
            };
        }, [id]);        if(!activity) {
            return (
                <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }} className="fade-in">
                    <Card sx={{ mb: 3, borderRadius: '12px', p: 3 }}>
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <CircularProgress size={28} />
                            <Box>
                                <Typography variant="h6">Loading activity details</Typography>
                                <Typography color="text.secondary">Trying to fetch activity and recommendation — this may take a few seconds.</Typography>
                            </Box>
                            <Box sx={{ ml: 'auto' }}>
                                <Button onClick={() => window.location.reload()} variant="outlined">Refresh</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Box>
            )
        }
  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }} className="fade-in">
        <Card 
            sx={{ 
                mb: 3,
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
            }}
        >
            <CardContent sx={{ p: 4 }}>
                <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                        fontWeight: 600,
                        color: '#1976d2',
                        mb: 3
                    }}
                >
                    Activity Details
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3, mb: 3 }}>
                    <Box className="activity-stat" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" color="text.secondary">Type</Typography>
                        <Typography variant="h6">
                            {activity ? (
                                activity.customType && activity.customType.trim() !== '' ? (
                                    activity.customType
                                ) : (
                                    <>
                                        {activity.type === 'RUNNING' ? '🏃' : 
                                         activity.type === 'WALKING' ? '🚶' :
                                         activity.type === 'CYCLING' ? '🚲' :
                                         activity.type === 'SWIMMING' ? '🏊' :
                                         activity.type === 'WEIGHT_TRAINING' ? '🏋️' :
                                         activity.type === 'YOGA' ? '🧘' :
                                         activity.type === 'HIIT' ? '🔥' :
                                         activity.type === 'CARDIO' ? '💓' :
                                         activity.type === 'STRETCHING' ? '🤸' : '➕'} {activity.type}
                                    </>
                                )
                            ) : 'N/A'}
                        </Typography>
                    </Box>
                    
                    <Box className="activity-stat" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" color="text.secondary">Duration</Typography>
                        <Typography variant="h6">
                            {activity?.duration ? `⏱️ ${activity.duration} minutes` : 'N/A'}
                        </Typography>
                    </Box>
                    
                    <Box className="activity-stat" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" color="text.secondary">Calories Burned</Typography>
                        <Typography variant="h6">
                            {activity?.caloriesBurned ? `🔥 ${activity.caloriesBurned} cal` : 'N/A'}
                        </Typography>
                    </Box>
                    
                    <Box className="activity-stat" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" color="text.secondary">Start Time</Typography>
                        <Typography variant="h6">
                            {activity?.startTime ? 
                                `📅 ${new Date(activity.startTime).toLocaleString()}` : 'N/A'}
                        </Typography>
                    </Box>

                    {/* Additional Metrics Section */}
                    {activity?.additionalMetrics && Object.keys(activity.additionalMetrics).length > 0 && (
                        <Box className="activity-stat" sx={{ p: 2, gridColumn: { xs: '1', sm: '1 / -1' } }}>
                            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                Additional Metrics
                            </Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                                {Object.entries(activity.additionalMetrics).map(([key, value]) => (
                                    <Box key={key} sx={{ 
                                        p: 2, 
                                        bgcolor: 'rgba(25, 118, 210, 0.05)',
                                        borderRadius: 1,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </Typography>
                                        <Typography variant="body1">
                                            {typeof value === 'number' ? value.toFixed(2) : value}
                                            {key.toLowerCase().includes('speed') ? ' km/h' : 
                                             key.toLowerCase().includes('distance') ? ' km' :
                                             key.toLowerCase().includes('heart') ? ' bpm' : ''}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </CardContent>
        </Card>
        
                {!recommendation && (
                        <Card sx={{ mb: 2, p: 2, borderRadius: '12px' }}>
                            <CardContent>
                                <Typography variant="h6">Waiting for AI recommendation...</Typography>
                                <Typography color="text.secondary">This may take a few seconds. The page will update automatically when the recommendation is ready.</Typography>
                            </CardContent>
                        </Card>
                )}

                {!recommendation ? (
            <Card sx={{ borderRadius: '16px', mb: 2 }}>
                <CardContent sx={{ 
                    p: 4, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2 
                }}>
                    <CircularProgress size={24} />
                    <Typography>
                        Generating AI recommendation... This may take a few moments.
                    </Typography>
                </CardContent>
            </Card>
        ) : (
            <Card 
                sx={{ 
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Typography 
                        variant="h4" 
                        gutterBottom 
                        sx={{ 
                            fontWeight: 600,
                            color: '#1976d2',
                            mb: 3
                        }}
                    >
                        AI Recommendation
                    </Typography>
                    
                    <Box sx={{ mb: 4 }}>
                        <Typography 
                            variant="h6" 
                            sx={{ 
                                color: '#2c3e50',
                                mb: 2
                            }}
                        >
                            Analysis
                        </Typography>
                        <Typography 
                            paragraph 
                            sx={{ 
                                backgroundColor: 'rgba(25, 118, 210, 0.05)',
                                p: 2,
                                borderRadius: '8px',
                                lineHeight: 1.8
                            }}
                        >
                            {typeof recommendation === 'string'
                                ? recommendation
                                : recommendation?.analysis || recommendation?.recommendation || activity?.recommendation?.analysis || activity?.analysis || 'No analysis available.'}
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography 
                        variant="h6" 
                        sx={{ 
                            color: '#2c3e50',
                            mb: 2
                        }}
                    >
                        Improvements
                    </Typography>
                    {(
                        (typeof recommendation === 'object' && recommendation?.improvements) || activity?.improvements || activity?.recommendation?.improvements
                    )?.length > 0 ? (
                        ((typeof recommendation === 'object' && recommendation?.improvements) || activity?.improvements || activity?.recommendation?.improvements).map((improvement, index) => (
                            <Typography key={index} paragraph>
                                • {improvement}
                            </Typography>
                        ))
                    ) : (
                        <Typography color="text.secondary">No improvements available.</Typography>
                    )}
                        <Divider sx={{ my: 2 } } />

                        <Typography variant="h6">Suggestions</Typography>
                        {(
                            (typeof recommendation === 'object' && recommendation?.suggestions) || activity?.suggestions || activity?.recommendation?.suggestions
                        )?.length > 0 ? (
                            ((typeof recommendation === 'object' && recommendation?.suggestions) || activity?.suggestions || activity?.recommendation?.suggestions).map((suggestion, index) => (
                                <Typography key={index} paragraph>• {suggestion}</Typography>
                            ))
                        ) : (
                            <Typography color="text.secondary">No suggestions available.</Typography>
                        )}
                        <Divider sx={{ my: 2 } } />

                        <Typography variant="h6">Safety - Guidelines</Typography>
                        {(
                            (typeof recommendation === 'object' && recommendation?.safety) || activity?.safety || activity?.recommendation?.safety
                        )?.length > 0 ? (
                            ((typeof recommendation === 'object' && recommendation?.safety) || activity?.safety || activity?.recommendation?.safety).map((safety, index) => (
                                <Typography key={index} paragraph>• {safety}</Typography>
                            ))
                        ) : (
                            <Typography color="text.secondary">No safety guidelines available.</Typography>
                        )}

                </CardContent>
            </Card>
        )}
    </Box>
  )
}

export default ActivityDetail