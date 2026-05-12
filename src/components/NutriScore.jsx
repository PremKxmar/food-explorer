const GRADES = ['a', 'b', 'c', 'd', 'e'];

export default function NutriScore({ grade, size = 'md' }) {
  const normalizedGrade = (grade || '').toLowerCase();
  const isValid = GRADES.includes(normalizedGrade);

  if (!isValid) {
    return (
      <div className="nutriscore-badge">
        <span className="grade-chip bg-surface-container-high text-on-surface-variant active">?</span>
      </div>
    );
  }

  return (
    <div className="nutriscore-badge" aria-label={`Nutrition score: ${normalizedGrade.toUpperCase()}`}>
      {GRADES.map((g) => (
        <span
          key={g}
          className={`grade-chip grade-${g} ${g === normalizedGrade ? 'active' : ''}`}
        >
          {g.toUpperCase()}
        </span>
      ))}
    </div>
  );
}
