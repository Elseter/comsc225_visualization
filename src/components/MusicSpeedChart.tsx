import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const musicSpeedData = [
  {
    name: '> 70% Music',
    mph: 8.33,
  },
  {
    name: '≤ 70% Music',
    mph: 6.32,
  },
];

export default function MusicSpeedChart() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      margin: '2rem auto',
      padding: '1.5rem',
      backgroundColor: 'var(--card-background)',
      borderRadius: 'var(--border-radius)',
      boxShadow: 'var(--shadow)',
      transition: 'var(--transition)',
      fontFamily: 'var(--body-font)'
    }}>
      <h2 style={{
        fontFamily: 'var(--header-font)',
        color: 'var(--primary-color)',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        Average Speed by Music Engagement
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={musicSpeedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="var(--text-color)" />
          <YAxis label={{ value: 'Speed (mph)', angle: -90, position: 'insideLeft', fill: 'var(--text-color)' }} stroke="var(--text-color)" />
          <Tooltip
            contentStyle={{ backgroundColor: 'var(--card-background)', borderColor: 'var(--primary-color)' }}
            labelStyle={{ color: 'var(--primary-color)' }}
            itemStyle={{ color: 'var(--accent-color)' }}
          />
          <Bar dataKey="mph" fill="var(--accent-color)" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
