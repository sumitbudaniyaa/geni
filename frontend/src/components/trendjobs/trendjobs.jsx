import { useState } from 'react';
import './trendjobs.css';
import trendingJobs from '../trendinjobs';

const TrendJobs = () => {
  const [openJobIndex, setOpenJobIndex] = useState(null);

  const toggleCard = (index) => {
    setOpenJobIndex(openJobIndex === index ? null : index);
  };

  return (
    <div className="trendjobs">
      {trendingJobs.map((job, index) => (
        <div
          className={openJobIndex === index ? 'jobcard clicked' : 'jobcard'}
          onClick={() => toggleCard(index)}
          key={index}
        >
          <h2>{job.title}</h2>
          {openJobIndex === index && (
            <div className="job-details">
              <p><strong>Domain:</strong> {job.domain}</p>
              <p><strong>Expected Salary:</strong> {job.expectedSalary}</p>
              <p><strong>Description:</strong> {job.description}</p>
              <p><strong>Skills:</strong> {job.skills.join(', ')}</p>
              <p><strong>Path:</strong></p>
              <ul>
                {job.path.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
              <p><strong>Leading Companies:</strong> {job.leadingCompanies.join(', ')}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrendJobs;
