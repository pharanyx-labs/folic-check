export interface NewsItem {
  id: string
  date: string // ISO date, or a month-precision string like "2025-09"
  title: string
  summary: string
  href: string
}

export interface TimelineEvent {
  id: string
  date: string
  label: string
  description: string
}

export const policyTimeline: TimelineEvent[] = [
  {
    id: 'announcement',
    date: '2021',
    label: 'Policy announced',
    description:
      'Following long-running advice from the Scientific Advisory Committee on Nutrition (SACN), the UK government announced plans to mandate folic acid fortification of non-wholemeal wheat flour to reduce neural tube defects (NTDs) such as spina bifida.',
  },
  {
    id: 'regulations',
    date: '2024',
    label: 'Regulations laid',
    description: 'The Bread and Flour Regulations were updated to add mandatory folic acid fortification alongside the pre-existing calcium, iron, niacin and thiamin requirements.',
  },
  {
    id: 'rollout-start',
    date: 'Autumn 2025',
    label: 'Rollout begins',
    description: 'Millers and manufacturers began transitioning production; some non-wholemeal wheat flour and flour-containing products started carrying added folic acid ahead of the compliance deadline.',
  },
  {
    id: 'compliance-deadline',
    date: '13 Dec 2026',
    label: 'Full compliance deadline',
    description: 'All non-wholemeal wheat flour sold in the UK (with limited exemptions) must be fortified with 250 µg of folic acid per 100 g from this date.',
  },
]

export const newsData: NewsItem[] = [
  {
    id: 'sacn-advice',
    date: '2017',
    title: 'SACN recommends mandatory fortification',
    summary:
      'The Scientific Advisory Committee on Nutrition\'s review concluded mandatory fortification would meaningfully reduce NTD-affected pregnancies, while flagging the need for an upper-intake safeguard for higher-risk groups.',
    href: 'https://www.gov.uk',
  },
  {
    id: 'gov-announcement',
    date: '2021',
    title: 'Government confirms fortification will go ahead',
    summary: 'UK, Scottish and Welsh governments jointly announced the policy, citing consistency with over 60 other countries that already mandate folic acid fortification.',
    href: 'https://www.gov.uk',
  },
  {
    id: 'fsa-guidance',
    date: '2025',
    title: 'FSA publishes industry guidance on the transition',
    summary: 'The Food Standards Agency set out labelling and compliance guidance for millers and manufacturers ahead of the December 2026 deadline.',
    href: 'https://www.food.gov.uk',
  },
  {
    id: 'real-bread-response',
    date: '2025',
    title: 'Real Bread Campaign calls for clearer labelling',
    summary: 'The Real Bread Campaign has pressed for consistent, prominent labelling so shoppers who want to avoid fortified flour can identify products easily during the rollout.',
    href: 'https://www.realbreadcampaign.org',
  },
  {
    id: 'public-petition',
    date: '2025–2026',
    title: 'Public petitions on mandatory fortification',
    summary: 'Multiple petitions have been raised on the UK Parliament petitions site both supporting and opposing aspects of the policy — search the petitions site for the current status of any live petition.',
    href: 'https://petition.parliament.uk',
  },
]
