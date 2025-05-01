import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../pages/Home.css'; // Assuming you have a styles.css file with your root variables

// Define the type for our activity data based on the CSV headers
interface ActivityData {
  activityId: string;
  activityName: string;
  startTimeLocal: string;
  startTimeGMT: string;
  activityType: string;
  eventType: string;
  distance: string;
  duration: string;
  elapsedDuration: string;
  movingDuration: string;
  elevationGain: string;
  elevationLoss: string;
  averageSpeed: string;
  maxSpeed: string;
  startLatitude: string;
  startLongitude: string;
  hasPolyline: string;
  hasImages: string;
  ownerId: string;
  ownerDisplayName: string;
  ownerFullName: string;
  ownerProfileImageUrlSmall: string;
  ownerProfileImageUrlMedium: string;
  ownerProfileImageUrlLarge: string;
  calories: string;
  bmrCalories: string;
  averageHR: string;
  maxHR: string;
  averageRunningCadenceInStepsPerMinute: string;
  maxRunningCadenceInStepsPerMinute: string;
  steps: string;
  userRoles: string;
  privacy: string;
  userPro: string;
  hasVideo: string;
  timeZoneId: string;
  beginTimestamp: string;
  sportTypeId: string;
  aerobicTrainingEffect: string;
  anaerobicTrainingEffect: string;
  avgStrideLength: string;
  vO2MaxValue: string;
  deviceId: string;
  minElevation: string;
  maxElevation: string;
  maxDoubleCadence: string;
  summarizedDiveInfo: string;
  maxVerticalSpeed: string;
  manufacturer: string;
  locationName: string;
  lapCount: string;
  endLatitude: string;
  endLongitude: string;
  waterEstimated: string;
  trainingEffectLabel: string;
  activityTrainingLoad: string;
  minActivityLapDuration: string;
  aerobicTrainingEffectMessage: string;
  anaerobicTrainingEffectMessage: string;
  splitSummaries: string;
  hasSplits: string;
  moderateIntensityMinutes: string;
  vigorousIntensityMinutes: string;
  differenceBodyBattery: string;
  hasHeatMap: string;
  hrTimeInZone_1: string;
  hrTimeInZone_2: string;
  hrTimeInZone_3: string;
  hrTimeInZone_4: string;
  hrTimeInZone_5: string;
  pr: string;
  autoCalcCalories: string;
  elevationCorrected: string;
  atpActivity: string;
  favorite: string;
  decoDive: string;
  parent: string;
  manualActivity: string;
  purposeful: string;
  avgPower: string;
  maxPower: string;
  normPower: string;
  avgVerticalOscillation: string;
  avgGroundContactTime: string;
  avgVerticalRatio: string;
  avgGradeAdjustedSpeed: string;
  fastestSplit_1000: string;
  fastestSplit_1609: string;
  fastestSplit_5000: string;
  powerTimeInZone_1: string;
  powerTimeInZone_2: string;
  powerTimeInZone_3: string;
  powerTimeInZone_4: string;
  powerTimeInZone_5: string;
  workoutId: string;
  fastestSplit_10000: string;
  description: string;
  fastestSplit_21098: string;
  strokes: string;
  avgStrokeDistance: string;
  maxStrokeCadence: string;
}

// Define the type for chart data
interface SpeedChartData {
  date: string;
  averageSpeed: number;
}

// Add chart-specific CSS
const chartStyles = `
  .chart-container {
    background-color: var(--card-background);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow);
    padding: 24px;
    margin-top: 32px;
    transition: var(--transition);
  }
  
  .chart-container:hover {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  }
  
  .chart-title {
    font-family: var(--header-font);
    color: var(--primary-color);
    margin-bottom: 8px;
    font-size: 1.5rem;
  }
  
  .chart-description {
    font-family: var(--body-font);
    color: var(--text-color);
    opacity: 0.8;
    margin-bottom: 24px;
    font-size: 0.9rem;
  }
  
  .chart-section {
    margin-top: 32px;
  }
  
  .no-data-message {
    font-family: var(--body-font);
    color: var(--text-color);
    padding: 48px;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.03);
    border-radius: var(--border-radius);
  }
  
  .recharts-default-tooltip {
    background-color: var(--card-background) !important;
    border: none !important;
    border-radius: var(--border-radius) !important;
    box-shadow: var(--shadow) !important;
    padding: 12px !important;
  }
  
  .recharts-tooltip-label {
    color: var(--primary-color) !important;
    font-weight: bold !important;
    margin-bottom: 8px !important;
  }
  
  .recharts-tooltip-item {
    color: var(--text-color) !important;
  }
`;

export default function ActivityDataLoader() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalActivities: number;
    totalDistance: number;
    totalDuration: number;
    totalElevationGain: number;
    averageHR: number;
    totalCalories: number;
  }>({
    totalActivities: 0,
    totalDistance: 0,
    totalDuration: 0,
    totalElevationGain: 0,
    averageHR: 0,
    totalCalories: 0,
  });
  const [speedOverTimeData, setSpeedOverTimeData] = useState<SpeedChartData[]>([]);

  // Function to load CSV data
  const loadCSVData = async () => {
    try {
      setLoading(true);
      
      // Path to CSV file on server
      const csvFilePath = './garmin_activities.csv'; 
      
      // Fetch the CSV file
      const response = await fetch(csvFilePath);
      
      if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
      }
      
      const csvText = await response.text();
      
      // Check if the CSV starts with 'activities.csv' and remove it if present
      const cleanedCsvText = csvText.startsWith('activities.csv') 
        ? csvText.substring('activities.csv'.length) 
        : csvText;
      
      // Parse CSV data using PapaParse
      Papa.parse<ActivityData>(cleanedCsvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            console.error('CSV parsing errors:', results.errors);
            setError('Error parsing CSV data');
          } else {
            // Set activities data
            setActivities(results.data);
            
            // Calculate stats from parsed data
            calculateStats(results.data);
            
            // Prepare speed over time data for non-treadmill running activities
            prepareSpeedOverTimeData(results.data);
          }
          setLoading(false);
        },
        error: (error: any) => {
          console.error('CSV parsing error:', error);
          setError('Error parsing CSV data');
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Error loading CSV:', err);
      setError(err instanceof Error ? err.message : 'Unknown error loading CSV');
      setLoading(false);
    }
  };

  // Calculate stats from activities data
  const calculateStats = (data: ActivityData[]) => {
    // Convert string values to numbers for calculations
    const totalDistance = data.reduce((sum, activity) => {
      const distance = parseFloat(activity.distance);
      return sum + (isNaN(distance) ? 0 : distance);
    }, 0);
  
    const totalDuration = data.reduce((sum, activity) => {
      const duration = parseFloat(activity.duration);
      return sum + (isNaN(duration) ? 0 : duration);
    }, 0);
  
    const totalElevationGain = data.reduce((sum, activity) => {
      const gain = parseFloat(activity.elevationGain as string);
      return sum + (isNaN(gain) ? 0 : gain);
    }, 0);

    const averageHR = data.reduce((sum, activity) => {
      const hr = parseFloat(activity.averageHR);
      return sum + (isNaN(hr) ? 0 : hr);
    }, 0) / data.filter(a => !isNaN(parseFloat(a.averageHR))).length || 0;

    const totalCalories = data.reduce((sum, activity) => {
      const calories = parseFloat(activity.calories);
      return sum + (isNaN(calories) ? 0 : calories);
    }, 0) / data.filter(a => !isNaN(parseFloat(a.calories))).length || 0;
  
    setStats({
      totalActivities: data.length,
      totalDistance,
      totalDuration,
      totalElevationGain,
      averageHR,
      totalCalories,
    });
  };
  
  // Prepare speed over time data for non-treadmill running activities
  const prepareSpeedOverTimeData = (data: ActivityData[]) => {
    // Filter for running activities that are not treadmill runs
    const runningActivities = data.filter(activity => 
        activity.activityType.toLowerCase().includes('running') && 
        !activity.activityName.toLowerCase().includes('treadmill')
      );
    
    // Sort activities by start time
    const sortedActivities = [...runningActivities].sort((a, b) => {
      const dateA = new Date(a.startTimeLocal).getTime();
      const dateB = new Date(b.startTimeLocal).getTime();
      return dateA - dateB;
    });
    
    // Create chart data with date and speed
    const chartData: SpeedChartData[] = sortedActivities.map(activity => {
      // Parse date for x-axis
      const date = new Date(activity.startTimeLocal);
      console.log('Parsed date:', date); // Debugging line
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      // Calculate speed in km/h
      // Convert from m/s to km/h (multiply by 3.6)
      const avgSpeed = parseFloat(activity.averageSpeed);
      const speedInKmH = isNaN(avgSpeed) ? 0 : avgSpeed * 3.6;
      
      return {
        date: formattedDate,
        averageSpeed: parseFloat(speedInKmH.toFixed(2))
      };
    });
    
    setSpeedOverTimeData(chartData);
  };

  // Load CSV data on component mount
  useEffect(() => {
    loadCSVData();
  }, []);

  // Group activities by type
  const activityTypeGroups = activities.reduce((groups: Record<string, ActivityData[]>, activity) => {
    const type = activity.activityType || 'Unknown';
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(activity);
    return groups;
  }, {});
  
  // Additional styles for stats cards to match the chart styling
  const statsStyles = `
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }
    
    .stat-card {
      background-color: var(--card-background);
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      padding: 24px;
      transition: var(--transition);
    }
    
    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
    }
    
    .stat-card h3 {
      font-family: var(--header-font);
      color: var(--primary-color);
      font-size: 1.2rem;
      margin-bottom: 12px;
    }
    
    .stat-value {
      font-family: var(--header-font);
      font-size: 2.2rem;
      font-weight: bold;
      color: var(--secondary-color);
      margin-bottom: 8px;
    }
    
    .stat-description {
      font-family: var(--body-font);
      color: var(--text-color);
      opacity: 0.8;
      font-size: 0.9rem;
    }
    
    .loading-indicator {
      text-align: center;
      padding: 48px;
      font-family: var(--body-font);
      color: var(--primary-color);
      font-size: 1.2rem;
    }
    
    .error-message {
      background-color: #FEE2E2;
      border-radius: var(--border-radius);
      padding: 24px;
      text-align: center;
      color: #DC2626;
    }
    
    .retry-button {
      background-color: var(--primary-color);
      color: var(--light-text);
      border: none;
      border-radius: var(--border-radius);
      padding: 8px 16px;
      margin-top: 16px;
      font-family: var(--body-font);
      cursor: pointer;
      transition: var(--transition);
    }
    
    .retry-button:hover {
      background-color: var(--secondary-color);
    }
    
    .section-title {
      font-family: var(--header-font);
      color: var(--primary-color);
      margin-bottom: 32px;
      font-size: 2rem;
      text-align: center;
    }
  `;

  // Stats display component
  const StatsDisplay = () => (
    <>
      <style>{statsStyles}</style>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Activities</h3>
          <div className="stat-value">{stats.totalActivities}</div>
          <div className="stat-description">Number of recorded activities</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Distance</h3>
          <div className="stat-value">{(stats.totalDistance / 1000).toFixed(1)} km</div>
          <div className="stat-description">Distance covered across all activities</div>
        </div>
        
        <div className="stat-card">
          <h3>Total Duration</h3>
          <div className="stat-value">
            {Math.floor(stats.totalDuration / 3600)} hrs
          </div>
          <div className="stat-description">Time spent on activities</div>
        </div>
        
        <div className="stat-card">
          <h3>Elevation Gain</h3>
          <div className="stat-value">{stats.totalElevationGain.toFixed(0)} m</div>
          <div className="stat-description">Total elevation gain</div>
        </div>

        <div className="stat-card">
          <h3>Average Heart Rate</h3>
          <div className="stat-value">{stats.averageHR.toFixed(0)} bpm</div>
          <div className="stat-description">Average Heart Rate</div>
        </div>

        <div className="stat-card">
          <h3>Average Calories Burned</h3>
          <div className="stat-value">{stats.totalCalories.toFixed(0)}</div>
          <div className="stat-description">Average calories burned per activity</div>
        </div>
      </div>
    </>
  );
  
  // Speed Over Time Chart component
  const SpeedOverTimeChart = () => (
    <div className="chart-container">
      <h3 className="chart-title">Average Running Speed Over Time</h3>
      <div className="chart-description">Non-treadmill running activities only</div>
      
      {speedOverTimeData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={speedOverTimeData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" />
            <XAxis 
              dataKey="date" 
              angle={-45}
              textAnchor="end"
              height={70}
              tickFormatter={(date) => {
                // Format date to be more readable
                const parts = date.split('-');
                return `${parts[1]}/${parts[2]}/${parts[0].substring(2)}`;
              }}
              tick={{ fill: 'var(--text-color)' }}
              axisLine={{ stroke: 'var(--text-color)' }}
            />
            <YAxis 
              label={{ 
                value: 'Speed (km/h)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: 'var(--text-color)', fontFamily: 'var(--body-font)' }
              }}
              domain={['auto', 'auto']}
              tick={{ fill: 'var(--text-color)' }}
              axisLine={{ stroke: 'var(--text-color)' }}
            />
            <Tooltip 
              formatter={(value) => [`${value} km/h`, 'Average Speed']}
              labelFormatter={(date) => {
                // Format date in tooltip
                const parts = date.split('-');
                return `Date: ${parts[1]}/${parts[2]}/${parts[0]}`;
              }}
              contentStyle={{ 
                backgroundColor: 'var(--card-background)',
                border: 'none',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow)',
                fontFamily: 'var(--body-font)',
                color: 'var(--text-color)'
              }}
            />
            <Legend 
              wrapperStyle={{
                fontFamily: 'var(--body-font)',
                color: 'var(--text-color)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="averageSpeed" 
              name="Average Speed" 
              stroke="var(--primary-color)" 
              strokeWidth={2}
              activeDot={{ 
                r: 8, 
                fill: 'var(--accent-color)',
                stroke: 'var(--primary-color)',
                strokeWidth: 2
              }} 
              dot={{ 
                r: 4, 
                fill: 'var(--card-background)',
                stroke: 'var(--primary-color)',
                strokeWidth: 2
              }} 
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="no-data-message">
          No running activity data available
        </div>
      )}
    </div>
  );

  return (
    <div className="content-section">
      <style>{chartStyles}</style>
      <div className="container">
        <h2 className="section-title">Activity Dashboard</h2>
        
        {loading ? (
          <div className="loading-indicator">Loading activity data...</div>
        ) : error ? (
          <div className="error-message">
            <p>Error loading activities: {error}</p>
            <button onClick={loadCSVData} className="retry-button">Retry</button>
          </div>
        ) : (
          <>
            <StatsDisplay />
            <div className="chart-section">
              <SpeedOverTimeChart />
            </div>
          </>
        )}
      </div>
    </div>
  );
}