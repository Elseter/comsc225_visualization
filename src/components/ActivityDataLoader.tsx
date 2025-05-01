import { useState, useEffect } from 'react';
import Papa from 'papaparse';

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

export default function ActivityDataLoader() {
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalActivities: number;
    totalDistance: number;
    totalDuration: number;
    totalElevationGain: number;
  }>({
    totalActivities: 0,
    totalDistance: 0,
    totalDuration: 0,
    totalElevationGain: 0,
  });

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
      const gain = parseFloat((activity as any).elevationGain); // Add elevationGain to interface if needed
      return sum + (isNaN(gain) ? 0 : gain);
    }, 0);
  
    setStats({
      totalActivities: data.length,
      totalDistance,
      totalDuration,
      totalElevationGain
    });
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

  console.log('Activity Type Groups:', activityTypeGroups);

  
  
  // Stats display component
  const StatsDisplay = () => (
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
    </div>
  );


  
  

  return (
    <div className="content-section">
      <div className="container">
        <h2 className="section-title"> Activity Dashboard</h2>
        
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
          </>
        )}
      </div>
    </div>
  );
};

