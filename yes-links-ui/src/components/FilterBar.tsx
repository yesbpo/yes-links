import React, { useState } from 'react'
import { Search, Filter } from 'lucide-react'

interface FilterBarProps {
  campaigns: string[]
  onFilterChange: (filters: { search: string; campaign: string }) => void
}

export const FilterBar: React.FC<FilterBarProps> = ({ campaigns, onFilterChange }) => {
  const [search, setSearch] = useState('')
  const [campaign, setCampaign] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    onFilterChange({ search: value, campaign })
  }

  const handleCampaignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setCampaign(value)
    onFilterChange({ search, campaign: value })
  }

  return (
    <div className="yes-link-flex yes-link-flex-col yes-link-gap-4 md:yes-link-flex-row md:yes-link-items-center">
      <div className="yes-link-relative yes-link-flex-1">
        <Search className="yes-link-absolute yes-link-left-3 yes-link-top-1/2 yes-link-h-4 yes-link-w-4 yes-link-translate-y-[-50%] yes-link-text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search links..."
          className="yes-link-h-10 yes-link-w-full yes-link-rounded-md yes-link-border yes-link-border-muted yes-link-bg-background yes-link-pl-10 yes-link-pr-3 yes-link-text-sm yes-link-ring-offset-background placeholder:yes-link-text-muted-foreground focus-visible:yes-link-outline-none focus-visible:yes-link-ring-2 focus-visible:yes-link-ring-primary focus-visible:yes-link-ring-offset-2"
        />
      </div>
      
      <div className="yes-link-relative yes-link-w-full md:yes-link-w-48">
        <Filter className="yes-link-absolute yes-link-left-3 yes-link-top-1/2 yes-link-h-4 yes-link-w-4 yes-link-translate-y-[-50%] yes-link-text-muted-foreground" />
        <select
          value={campaign}
          onChange={handleCampaignChange}
          className="yes-link-h-10 yes-link-w-full yes-link-appearance-none yes-link-rounded-md yes-link-border yes-link-border-muted yes-link-bg-background yes-link-pl-10 yes-link-pr-8 yes-link-text-sm focus-visible:yes-link-outline-none focus-visible:yes-link-ring-2 focus-visible:yes-link-ring-primary"
        >
          <option value="">All Campaigns</option>
          {campaigns.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <div className="yes-link-pointer-events-none yes-link-absolute yes-link-right-3 yes-link-top-1/2 yes-link-translate-y-[-50%]">
          <svg className="yes-link-h-4 yes-link-w-4 yes-link-text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}
