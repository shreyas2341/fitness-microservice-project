import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { addActivity } from '../services/api'



const ActivityForm = ({ onActivityAdded }) => {

    const[activity, setActivity]=useState({
        type: "RUNNING", 
        duration: '', 
        caloriesBurned: '',
        startTime: new Date().toISOString(),
        additionalMetrics: {}
    })
    
    // State to handle new metric key-value pairs
    const [newMetric, setNewMetric] = useState({ key: '', value: '' });

    const handleAddMetric = () => {
        if (newMetric.key && newMetric.value) {
            setActivity(prev => ({
                ...prev,
                additionalMetrics: {
                    ...prev.additionalMetrics,
                    [newMetric.key]: Number(newMetric.value)
                }
            }));
            setNewMetric({ key: '', value: '' }); // Reset input fields
        }
    };

    const handleRemoveMetric = (keyToRemove) => {
        setActivity(prev => {
            const newMetrics = { ...prev.additionalMetrics };
            delete newMetrics[keyToRemove];
            return {
                ...prev,
                additionalMetrics: newMetrics
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            await addActivity(activity);
            onActivityAdded();
            setActivity({
                type: "RUNNING", 
                duration: '', 
                caloriesBurned: '',
                startTime: new Date().toISOString(),
                additionalMetrics: {}
            });
        } catch (error) {
            console.error(error);
        }
    }

  return (
    <Box 
        component="form" 
        onSubmit={handleSubmit} 
        sx={{ 
            mb: 4,
            p: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
        className="fade-in"
    >
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Activity Type</InputLabel>
            <Select
                value={activity.type}
                onChange={(e) => setActivity({...activity, type: e.target.value})}
                sx={{
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                    }
                }}
            >
                <MenuItem value="RUNNING">🏃 Running</MenuItem>
                <MenuItem value="WALKING">🚶 Walking</MenuItem>
                <MenuItem value="CYCLING">🚲 Cycling</MenuItem>
                <MenuItem value="SWIMMING">🏊 Swimming</MenuItem>
                <MenuItem value="WEIGHT_TRAINING">🏋️ Weight Training</MenuItem>
                <MenuItem value="YOGA">🧘 Yoga</MenuItem>
                <MenuItem value="HIIT">🔥 HIIT</MenuItem>
                <MenuItem value="CARDIO">❤️ Cardio</MenuItem>
                <MenuItem value="STRETCHING">🤸 Stretching</MenuItem>
                <MenuItem value="OTHER">❓ Other</MenuItem>
            </Select>
        </FormControl>

        <TextField 
            fullWidth
            type="datetime-local"
            label="Start Time"
            sx={{ mb: 2 }}
            value={activity.startTime.slice(0, 16)} // Format for datetime-local input
            onChange={(e) => setActivity({...activity, startTime: new Date(e.target.value).toISOString()})}
            InputLabelProps={{ shrink: true }}
        />
        
        <TextField 
            fullWidth
            label="Duration (Minutes)"
            type='number'
            sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                }
            }}
            value={activity.duration}
            onChange={(e) => setActivity({...activity, duration: e.target.value})}
            InputProps={{
                startAdornment: '⏱️',
            }}
        />

        <TextField 
            fullWidth
            label="Calories Burned"
            type='number'
            sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                }
            }}
            value={activity.caloriesBurned}
            onChange={(e) => setActivity({...activity, caloriesBurned: e.target.value})}
            InputProps={{
                startAdornment: '🔥',
            }}
        />

        {/* Additional Metrics Section */}
        <Box sx={{ mb: 3, mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Additional Metrics</Typography>
            
            {/* Display current metrics */}
            {Object.entries(activity.additionalMetrics).map(([key, value]) => (
                <Box key={key} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <TextField
                        disabled
                        label="Metric Name"
                        value={key}
                        sx={{ flex: 1 }}
                    />
                    <TextField
                        disabled
                        label="Value"
                        value={value}
                        sx={{ flex: 1 }}
                    />
                    <Button 
                        onClick={() => handleRemoveMetric(key)}
                        variant="outlined"
                        color="error"
                        sx={{ minWidth: 'auto', p: '8px' }}
                    >
                        ✕
                    </Button>
                </Box>
            ))}
            
            {/* Add new metric */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'flex-start' }}>
                <TextField
                    label="Metric Name"
                    value={newMetric.key}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, key: e.target.value }))}
                    placeholder="e.g., distance, averageSpeed"
                    sx={{ flex: 1 }}
                />
                <TextField
                    label="Value"
                    type="number"
                    value={newMetric.value}
                    onChange={(e) => setNewMetric(prev => ({ ...prev, value: e.target.value }))}
                    placeholder="e.g., 7.5"
                    sx={{ flex: 1 }}
                />
                <Button 
                    onClick={handleAddMetric}
                    variant="contained"
                    sx={{ 
                        height: '56px',
                        minWidth: 'auto',
                        px: 3
                    }}
                >
                    Add
                </Button>
            </Box>
        </Box>
        
        <Button 
            type='submit' 
            variant='contained'
            fullWidth
            sx={{
                height: '48px',
                fontSize: '1.1rem'
            }}
        >
            Add Activity
        </Button>
    </Box>
  )
}

export default ActivityForm