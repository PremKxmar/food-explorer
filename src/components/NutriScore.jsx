import './NutriScore.css';

const GRADES = ['a', 'b', 'c', 'd', 'e'];

export default function NutriScore({ grade, size = 'md' }) {
  const normalizedGrade = (grade || '').toLowerCase();
  const isValid = GRADES.includes(normalizedGrade);

  if (!isValid) {
    return (
      <div className={`nutriscore nutriscore--${size}`}>
        <span className="nutriscore__badge nutriscore__badge--unknown">?</span>
      </div>
    );
  }

  return (
    <div className={`nutriscore nutriscore--${size}`} aria-label={`Nutrition score: ${normalizedGrade.toUpperCase()}`}>
      <div className="nutriscore__strip">
        {GRADES.map((g) => (
          <span
            key={g}
            className={`nutriscore__cell nutriscore__cell--${g} ${
              g === normalizedGrade ? 'nutriscore__cell--active' : ''
            }`}
          >
            {g.toUpperCase()}
          </span>
        ))}
      </div>
    </div>
  );
}
