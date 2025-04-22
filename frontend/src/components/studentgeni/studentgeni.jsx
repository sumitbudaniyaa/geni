import './studentgeni.css';
import { useState } from 'react';
import axios from 'axios';

const StudGeni = () => {


  const URL = import.meta.env.VITE_API_URL + "/api/recommend";

  const [formData, setFormData] = useState({
    class10: '',
    class12: '',
    exam: '',
    examscore: '',
    stream: '',
    interests: '',
    location: '',
    clgtype: '',
    budget: '',
    goal: '',
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
    const { class10, class12, stream, goal, exam, examscore, budget } = formData;
    if (!class10 || !class12 || !stream || !goal) {
      return 'Please fill all required fields (Class 10, Class 12, Stream, Goal).';
    }
    const numFields = { class10, class12, examscore, budget };
    for (const [key, value] of Object.entries(numFields)) {
      if (value && (isNaN(value) || Number(value) < 0)) {
        return `${key} must be a valid positive number.`;
      }
    }
    if (exam && exam !== 'None' && !examscore) {
      return 'Please provide a score for the selected competitive exam.';
    }
    if (Number(class10) > 100 || Number(class12) > 100) {
      return 'Class 10 and Class 12 percentages cannot exceed 100.';
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
    try {
      const res = await axios.post(URL, formData);
      setResponseData(res.data.recommendations);
      setShowResult(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="stud-geni">
        <h4>Tell us about you</h4>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          name="class10"
          onChange={handleChange}
          placeholder="Class 10th percentage (e.g., 80)"
          value={formData.class10}
        />
        <input
          type="text"
          name="class12"
          onChange={handleChange}
          placeholder="Class 12th percentage (e.g., 80)"
          value={formData.class12}
        />
        <select name="exam" onChange={handleChange} value={formData.exam}>
          <option value="" disabled>
            Any competitive exam if attempted
          </option>
          <option value="None">None</option>
          <option value="JEE">JEE</option>
          <option value="NEET">NEET</option>
        </select>
        <input
          type="text"
          name="examscore"
          onChange={handleChange}
          placeholder="Exam Score (e.g., Percentile)"
          value={formData.examscore}
        />
        <input
          type="text"
          name="stream"
          onChange={handleChange}
          placeholder="Preferred stream"
          value={formData.stream}
        />
        <input
          type="text"
          name="interests"
          onChange={handleChange}
          placeholder="Interests"
          value={formData.interests}
        />
        <input
          type="text"
          name="location"
          onChange={handleChange}
          placeholder="Location Preference"
          value={formData.location}
        />
           <input
          type="text"
          name="clgtype"
          onChange={handleChange}
          placeholder="Govt. or Pvt."
          value={formData.clgtype}
        />
        <input
          type="text"
          name="budget"
          onChange={handleChange}
          placeholder="Budget Cap (e.g., 1500000)"
          value={formData.budget}
        />
        <input
          type="text"
          name="goal"
          onChange={handleChange}
          placeholder="Career Goal"
          value={formData.goal}
        />
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
          <h3>Recommended Colleges:</h3>
          <ul>
            {responseData.map((college, index) => (
              <li key={index}>
                <h4>{college.name}</h4>
                <p><strong>Location:</strong> {college.location}</p>
                <p><strong>Fees:</strong> {college.fees}</p>
                <p><strong>Specialties:</strong> {college.specialties}</p>
                <p><strong>Why Suitable:</strong> {college.why_suitable}</p>
                <p><strong>Scholarships:</strong> {college.scholarships}</p>
                <p><a href={college.link} target="_blank" rel="noopener noreferrer">Visit Website</a></p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default StudGeni;