import { SlidersHorizontal, X } from 'lucide-react';

export default function Filters({ filters, onChange, onReset, mobileOpen, setMobileOpen }) {
  const subjects = ['All subjects', 'Mathematics', 'Science', 'English', 'Coding', 'Physics', 'Chemistry', 'Robotics'];
  return <>
    <button className="mobile-filter" onClick={() => setMobileOpen(true)}><SlidersHorizontal size={17} /> Filters</button>
    <aside className={`filters ${mobileOpen ? 'open' : ''}`}>
      <div className="filter-title"><h2>Filters</h2><button onClick={onReset}>Clear all</button><button className="close-filter" onClick={() => setMobileOpen(false)}><X size={20}/></button></div>
      <label>Child's grade<select value={filters.grade} onChange={e => onChange('grade', e.target.value)}><option>All grades</option>{[6,7,8,9,10].map(grade => <option key={grade}>Grade {grade}</option>)}</select></label>
      <label>Subject<select value={filters.subject} onChange={e => onChange('subject', e.target.value)}>{subjects.map(subject => <option key={subject}>{subject}</option>)}</select></label>
      <fieldset><legend>Price range</legend><div className="price-inputs"><label>Min<input type="number" placeholder="₹ 0" value={filters.min} onChange={e => onChange('min', e.target.value)} /></label><span>—</span><label>Max<input type="number" placeholder="₹ 2,000" value={filters.max} onChange={e => onChange('max', e.target.value)} /></label></div></fieldset>
      <fieldset><legend>Teacher rating</legend>{['Any rating', '4.5 & above', '4.0 & above'].map(item => <label className="radio" key={item}><input type="radio" name="rating" checked={filters.rating === item} onChange={() => onChange('rating', item)} /><span>{item}</span></label>)}</fieldset>
    </aside>
  </>;
}
