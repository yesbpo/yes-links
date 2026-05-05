import React from 'react'
import { i18n } from '@/lib/i18n'

type State = 'idle' | 'loading' | 'success' | 'error'

interface ClickData {
  day: string
  count: number
}

interface ClicksChartProps {
  state: State
  data: ClickData[]
}

export const ClicksChart: React.FC<ClicksChartProps> = ({ state, data }) => {
  const t = i18n.analytics

  return (
    <div className="rounded-xl border border-muted bg-background p-6 shadow-sm">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">{t.clicksOverTime}</h3>
      
      {state === 'loading' ? (
        <div 
          data-testid="chart-loading"
          className="h-[150px] w-full animate-pulse rounded-lg bg-muted" 
        />
      ) : data.length === 0 ? (
        <div className="flex h-[150px] items-center justify-center rounded-lg border border-dashed border-muted">
          <p className="text-xs text-muted-foreground">{t.noData}</p>
        </div>
      ) : (
        <>
          <div className="relative h-[150px] w-full">
            <svg 
              viewBox="0 0 500 150" 
              className="h-full w-full overflow-visible"
              preserveAspectRatio="none"
            >
              {renderChart(data)}
            </svg>
          </div>
          <div className="mt-4 flex justify-between text-[10px] font-medium text-muted-foreground">
            <span>{data[0].day}</span>
            <span>{data[data.length - 1].day}</span>
          </div>
        </>
      )}
    </div>
  )
}

const renderChart = (data: ClickData[]) => {
  const width = 500
  const height = 150
  const padding = 20
  const maxCount = Math.max(...data.map(d => d.count), 1)
  
  const pointsData = data.map((d, i) => {
    const x = padding + (i / (data.length - 1 || 1)) * (width - padding * 2)
    const y = height - padding - (d.count / maxCount) * (height - padding * 2)
    return { x, y }
  })

  const pointsString = pointsData.map(p => `${p.x},${p.y}`).join(' ')

  return (
    <>
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" className="text-muted/20" strokeWidth="1" />
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="text-muted/20" strokeWidth="1" />
      <path
        d={`M ${padding},${height - padding} L ${pointsString} L ${width - padding},${height - padding} Z`}
        className="text-primary/5"
        fill="currentColor"
      />
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pointsString}
        className="text-primary"
      />
      {pointsData.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          className="fill-background stroke-primary"
          strokeWidth="2"
        />
      ))}
    </>
  )
}
