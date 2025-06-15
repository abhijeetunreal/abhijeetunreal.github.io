
import React from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

type StreamGraphFilterProps = {
  tags: string[];
  activeTag: string | null;
  onTagChange: (tag: string | null) => void;
};

const StreamGraphFilter = ({ tags, activeTag, onTagChange }: StreamGraphFilterProps) => {
  const data = React.useMemo(() => {
    const points = 20;
    return Array.from({ length: points }, (_, i) => {
      const entry: { name: string; [key: string]: any } = { name: `p${i}` };
      tags.forEach((tag, tagIndex) => {
        entry[tag] = 10 + 5 * Math.sin(i / 3 + tagIndex * Math.PI / 4);
      });
      return entry;
    });
  }, [tags]);

  const colors = [
    'hsl(var(--muted-foreground))',
    'hsl(var(--accent))',
    'hsl(var(--secondary))',
    'hsl(var(--foreground))',
  ];
  const primaryColor = 'hsl(var(--primary))';
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataKey = payload[0].dataKey;
      return (
        <div className="bg-background border-2 border-border px-3 py-1 text-xs font-bold">
          <p className="text-foreground">{`[${dataKey.toUpperCase()}]`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-24 md:h-32 relative group">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          stackOffset="silhouette"
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
        >
          <Tooltip content={<CustomTooltip />} cursor={false} />
          {tags.map((tag, index) => (
            <Area
              key={tag}
              type="monotone"
              dataKey={tag}
              stackId="1"
              stroke={'hsl(var(--background))'}
              strokeWidth={3}
              fill={activeTag === tag ? primaryColor : colors[index % colors.length]}
              style={{
                  cursor: 'pointer',
                  opacity: activeTag === null || activeTag === tag ? 1 : 0.5,
                  transition: 'opacity 0.3s ease, fill 0.3s ease'
              }}
              onClick={() => onTagChange(tag)}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
       <button
        onClick={() => onTagChange(null)}
        className={`absolute top-2 right-2 text-xs font-bold border-2 px-3 py-1 transition-all duration-300 ${
          activeTag === null
            ? 'bg-primary text-primary-foreground border-primary'
            : 'bg-background border-accent hover:border-primary hover:text-primary'
        }`}
      >
        [ALL]
      </button>
    </div>
  );
};

export default StreamGraphFilter;
