import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { addActivity } from '../services/api'

const ActivityFormFixed = ({ onActivityAdded }) => {
  const [activity, setActivity] = useState({
    type: 'RUNNING',
    duration: '',
    caloriesBurned: '',
    startTime: new Date().toISOString(),
    additionalMetrics: {}
  })

  const [newMetric, setNewMetric] = useState({ key: '', value: '' })
  const [otherError, setOtherError] = useState(false)
  const [isEditingCustom, setIsEditingCustom] = useState(false)

  const handleAddMetric = () => {
    if (newMetric.key && newMetric.value) {
      setActivity((prev) => ({
        ...prev,
        additionalMetrics: {
          ...prev.additionalMetrics,
          [newMetric.key]: Number(newMetric.value)
        }
      }))
      setNewMetric({ key: '', value: '' })
    }
  }

  const handleRemoveMetric = (keyToRemove) => {
    setActivity((prev) => {
      const newMetrics = { ...prev.additionalMetrics }
      delete newMetrics[keyToRemove]
      return {
        ...prev,
        additionalMetrics: newMetrics
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isEditingCustom) {
      if (!activity.type || activity.type.trim() === '') {
        setOtherError(true)
        return
      }
    }

    try {
      const payload = { ...activity }
      if (isEditingCustom) {
        payload.customType = payload.type.trim()
        payload.type = 'OTHER'
      }
      await addActivity(payload)
      onActivityAdded()
      setActivity({
        type: 'RUNNING',
        duration: '',
        caloriesBurned: '',
        startTime: new Date().toISOString(),
        additionalMetrics: {}
      })
      setIsEditingCustom(false)
      setOtherError(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4, p: 3, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 2 }}>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Activity Type</InputLabel>
        {isEditingCustom ? (
          <TextField
            value={activity.type}
            onChange={(e) => {
              setActivity((prev) => ({ ...prev, type: e.target.value }))
              if (otherError) setOtherError(false)
            }}
            label="Activity (custom)"
            placeholder="e.g., Pushups"
            error={otherError}
            helperText={otherError ? 'Please enter a name for the activity.' : ''}
          />
        ) : (
          <Select
            value={activity.type}
            label="Activity Type"
            onChange={(e) => {
              const val = e.target.value
              if (val === 'OTHER') {
                setIsEditingCustom(true)
                setActivity((prev) => ({ ...prev, type: '' }))
              } else {
                setActivity((prev) => ({ ...prev, type: val }))
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
            <MenuItem value="CARDIO">💓 Cardio</MenuItem>
            <MenuItem value="STRETCHING">🤸 Stretching</MenuItem>
            <MenuItem value="OTHER">➕ Other</MenuItem>
          </Select>
        )}
      </FormControl>

      <TextField fullWidth type="datetime-local" label="Start Time" sx={{ mb: 2 }} value={activity.startTime.slice(0,16)} onChange={(e)=>setActivity({...activity, startTime: new Date(e.target.value).toISOString()})} InputLabelProps={{shrink:true}}/>
      <TextField fullWidth label="Duration (Minutes)" type="number" sx={{ mb: 2 }} value={activity.duration} onChange={(e)=>setActivity({...activity, duration:e.target.value})}/>
      <TextField fullWidth label="Calories Burned" type="number" sx={{ mb: 3 }} value={activity.caloriesBurned} onChange={(e)=>setActivity({...activity, caloriesBurned:e.target.value})}/>

      <Box sx={{ mb: 3, mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Additional Metrics</Typography>
        {Object.entries(activity.additionalMetrics).map(([key, value]) => (
          <Box key={key} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <TextField disabled label="Metric" value={key} sx={{ flex: 1 }} />
            <TextField disabled label="Value" value={value} sx={{ flex: 1 }} />
            <Button onClick={() => handleRemoveMetric(key)} variant="outlined" color="error">✕</Button>
          </Box>
        ))}

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField label="Metric Name" value={newMetric.key} onChange={(e)=>setNewMetric(prev=>({...prev, key:e.target.value}))} sx={{ flex: 1 }} />
          <TextField label="Value" type="number" value={newMetric.value} onChange={(e)=>setNewMetric(prev=>({...prev, value:e.target.value}))} sx={{ flex: 1 }} />
          <Button onClick={handleAddMetric} variant="contained">Add</Button>
        </Box>
      </Box>

      <Button type="submit" variant="contained" fullWidth>Add Activity</Button>
    </Box>
  )
}

export default ActivityFormFixed
