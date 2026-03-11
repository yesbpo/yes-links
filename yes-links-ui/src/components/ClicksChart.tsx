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
    <div className="yes-link-rounded-xl yes-link-border yes-link-border-muted yes-link-bg-background yes-link-p-6 yes-link-shadow-sm">
      <h3 className="yes-link-mb-4 yes-link-text-sm yes-link-font-medium yes-link-text-muted-foreground">{t.clicksOverTime}</h3>
      
      {state === 'loading' ? (
        <div 
          data-testid="chart-loading"
          className="yes-link-h-[150px] yes-link-w-full yes-link-animate-pulse yes-link-rounded-lg yes-link-bg-muted" 
        />
      ) : data.length === 0 ? (
        <div className="yes-link-flex yes-link-h-[150px] yes-link-items-center yes-link-justify-center yes-link-rounded-lg yes-link-border yes-link-border-dashed yes-link-border-muted">
          <p className="yes-link-text-xs yes-link-text-muted-foreground">{t.noData}</p>
        </div>
      ) : (
        <>
          <div className="yes-link-relative yes-link-h-[150px] yes-link-w-full">
            <svg 
              viewBox="0 0 500 150" 
              className="yes-link-h-full yes-link-w-full yes-link-overflow-visible"
              preserveAspectRatio="none"
            >
              {renderChart(data)}
            </svg>
          </div>
          <div className="yes-link-mt-4 yes-link-flex yes-link-justify-between yes-link-text-[10px] yes-link-font-medium yes-link-text-muted-foreground">
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
      <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="currentColor" className="yes-link-text-muted/20" strokeWidth="1" />
      <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="currentColor" className="yes-link-text-muted/20" strokeWidth="1" />
      <path
        d={`M ${padding},${height - padding} L ${pointsString} L ${width - padding},${height - padding} Z`}
        className="yes-link-text-primary/5"
        fill="currentColor"
      />
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pointsString}
        className="yes-link-text-primary"
      />
      {pointsData.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          className="yes-link-fill-background yes-link-stroke-primary"
          strokeWidth="2"
        />
      ))}
    </>
  )
}
