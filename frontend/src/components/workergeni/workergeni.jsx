import './workergeni.css'
import { useState } from 'react';
import axios from 'axios';

const WorkerGeni = () =>{

  const URL = import.meta.env.VITE_API_URL + "/api/upskill";

    const [formData, setFormData] = useState({
        currentSkills: '',
        desiredSkill: '',
        experienceLevel: '',
        industryPreference: '',
        budget: '',
        learningFormat: '',
        extra: '',
      });
      const [responseData, setResponseData] = useState([]);
      const [error, setError] = useState('');
      const [showResult, setShowResult] = useState(false);
      const [loading, setLoading] = useState(false);
    
      const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      };
    
      const validateForm = () => {
        const { currentSkills, desiredSkill, experienceLevel, budget } = formData;
        if (!currentSkills || !desiredSkill || !experienceLevel) {
          return 'Please fill all required fields (Current Skills, Desired Skill, Experience Level).';
        }
        if (budget && (isNaN(budget) || Number(budget) < 0)) {
          return 'Budget must be a valid positive number.';
        }
        if (experienceLevel && !['Beginner', 'Intermediate', 'Advanced'].includes(experienceLevel)) {
          return 'Please select a valid experience level.';
        }
        return '';
      };
    
      const handleSubmit = async () => {
        setError('');
        const validationError = validateForm();
        if (validationError) {
          setError(validationError);
          return;
        }
    
        setLoading(true);
        console.log('Submitting formData:', formData);
        try {
          const res = await axios.post(URL, formData);
          console.log('API response:', res.data);
          setResponseData(res.data.recommendations);
          setShowResult(true);
        } catch (err) {
          console.error('Frontend error:', err.response?.data || err.message);
          setError(err.response?.data?.error || 'Failed to fetch recommendations. Please try again.');
        } finally {
          setLoading(false);
        }
      };

    return(
        <>
        <div className="upskill">
          <h4>Plan Your Upskilling</h4>
          {error && <p className="error">{error}</p>}
          <input
            type="text"
            name="currentSkills"
            onChange={handleChange}
            placeholder="Current Skills (e.g., Python, Data Analysis)"
            value={formData.currentSkills}
          />
          <input
            type="text"
            name="desiredSkill"
            onChange={handleChange}
            placeholder="Desired Skill (e.g., Machine Learning)"
            value={formData.desiredSkill}
          />
          <select name="experienceLevel" onChange={handleChange} value={formData.experienceLevel}>
            <option value="" disabled>
              Experience Level
            </option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <input
            type="text"
            name="industryPreference"
            onChange={handleChange}
            placeholder="Industry Preference (e.g., Tech)"
            value={formData.industryPreference}
          />
          <input
            type="text"
            name="budget"
            onChange={handleChange}
            placeholder="Budget (e.g., 50000)"
            value={formData.budget}
          />
          <select name="learningFormat" onChange={handleChange} value={formData.learningFormat}>
            <option value="" disabled>
              Learning Format
            </option>
            <option value="Online">Online</option>
            <option value="In-Person">In-Person</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          <textarea
            name="extra"
            onChange={handleChange}
            placeholder="Anything else..."
            value={formData.extra}
          />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
  
        {showResult && responseData.length > 0 && (
          <div className="result-slide">
            <h3>Upskilling Recommendations:</h3>
            <ul>
              {responseData.map((rec, index) => (
                <li key={index}>
                  <h4>{rec.skill}</h4>
                  <p><strong>Upskilling Strategy:</strong> {rec.upskillingStrategy}</p>
                  <p><strong>Industries:</strong> {rec.industries}</p>
                  <p><strong>Course:</strong> {rec.courseName}</p>
                  <p><a href={rec.courseLink} target="_blank" rel="noopener noreferrer">Visit Course</a></p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </>
    )
}

export default WorkerGeni;