import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './InterviewResponses.css';
import '../pageloading.css';

// Create a context for managing audio players
const AudioPlayerContext = createContext();

// Provider component to manage audio players
const AudioPlayerProvider = ({ children }) => {
    const [currentlyPlaying, setCurrentlyPlaying] = useState(null);

    const pauseOthers = (id) => {
        if (currentlyPlaying && currentlyPlaying !== id) {
            setCurrentlyPlaying(id);
        } else {
            setCurrentlyPlaying(id);
        }
    };

    return (
        <AudioPlayerContext.Provider value={{ currentlyPlaying, pauseOthers }}>
            {children}
        </AudioPlayerContext.Provider>
    );
};

// LoadingAnimation component 
const LoadingAnimation = () => {
    return (
        <div className="loading-animation">
            <div className="seesaw-container">
                <div className="bar"></div>
                <div className="ball"></div>
            </div>
        </div>
    );
};

// New component for displaying performance metrics
const PerformanceAnalysis = ({ analysis }) => {
    const weights = {
        relevance: 0.30,
        clarity: 0.30,
        confidence: 0.30,
        engagement: 0.10
    };

    const getScoreColor = (score) => {
        if (score >= 0.7) return '#4caf50';
        if (score >= 0.4) return '#ff9800';
        return '#f44336';
    };

    const formatScore = (score) => {
        return `${(score * 100).toFixed(1)}%`;
    };

    if (!analysis) {
        return (
            <div className="performance-analysis empty-analysis">
                <p>No performance analysis data available.</p>
            </div>
        );
    }

    const getGrade = (score) => {
        if (score >= 0.8) return 'A';
        if (score >= 0.7) return 'B';
        if (score >= 0.6) return 'C';
        if (score >= 0.5) return 'D';
        if (score >= 0.4) return 'E';
        return 'F';
    };

    const analysisData = {
        clarity: analysis.clarity || 0,
        confidence: analysis.confidence || 0,
        engagement: analysis.engagement || 0,
        relevance: analysis.relevance || 0,
        totalScore: analysis.totalScore || 0
    };

    const achievementPercentages = {
        clarity: analysisData.clarity / weights.clarity,
        confidence: analysisData.confidence / weights.confidence,
        engagement: analysisData.engagement / weights.engagement,
        relevance: analysisData.relevance / weights.relevance
    };

    const totalScore = analysisData.totalScore;
    const relativeContributions = {
        clarity: analysisData.clarity / totalScore,
        confidence: analysisData.confidence / totalScore,
        engagement: analysisData.engagement / totalScore,
        relevance: analysisData.relevance / totalScore
    };

    const criterionColors = {
        relevance: '#f5b7b1',
        clarity: '#48c9b0',
        confidence: '#85c1e9',
        engagement: '#bb8fce'
    };

    return (
        <div className="performance-analysis">
            <div className="performance-header">
                <h2>Interview Performance Analysis</h2>
                <div className="overall-score">
                    <div className="score-badge" style={{ backgroundColor: getScoreColor(analysisData.totalScore) }}>
                        {getGrade(analysisData.totalScore)}
                    </div>
                    <div className="score-details">
                        <h3>Overall Score</h3>
                        <p>{formatScore(analysisData.totalScore)}</p>
                    </div>
                </div>
            </div>

            <div className="overall-score-composition">
                <h3>Overall Score Composition</h3>
                <div className="score-composition-container">
                    <div className="stacked-bar-outer">
                        <div 
                            className="stacked-bar-chart" 
                            style={{ 
                                width: `${analysisData.totalScore * 100}%`,
                                '--final-width': `${analysisData.totalScore * 100}%` 
                            }}
                        >
                            {Object.entries(relativeContributions).map(([criterion, proportion]) => (
                                <div
                                    key={criterion}
                                    className="stacked-segment"
                                    style={{
                                        width: `${proportion * 100}%`,
                                        backgroundColor: criterionColors[criterion],
                                    }}
                                    title={`${criterion.charAt(0).toUpperCase() + criterion.slice(1)}: ${formatScore(analysisData[criterion])} (${(proportion * 100).toFixed(1)}% of total)`}
                                ></div>
                            ))}
                        </div>
                    </div>
                    <div className="scale-markers">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                    </div>
                </div>
                <div className="chart-legend">
                    {Object.entries(criterionColors).map(([criterion, color]) => (
                        <div key={criterion} className="legend-item">
                            <div className="legend-color" style={{ backgroundColor: color }}></div>
                            <span className="legend-label">
                                {criterion.charAt(0).toUpperCase() + criterion.slice(1)}: {formatScore(analysisData[criterion])} 
                                {` (${weights[criterion] * 100}%)`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="metrics-container">
                <div key="clarity" className="metric-item">
                    <div className="metric-header">
                        <h4>Clarity</h4>
                        <div className="metric-scores">
                            <span className="achievement-score">
                                {(achievementPercentages.clarity * 100).toFixed(1)}%
                            </span>
                            <span className="weighted-score">
                                Score: {formatScore(analysisData.clarity)} / {formatScore(weights.clarity)}
                            </span>
                        </div>
                    </div>
                    
                    <div className="achievement-chart">
                        <div className="achievement-bar-container">
                            <div 
                                className="achievement-bar" 
                                style={{
                                    width: `${achievementPercentages.clarity * 100}%`,
                                    backgroundColor: criterionColors.clarity,
                                    '--final-width': `${achievementPercentages.clarity * 100}%`
                                }}
                            >
                                <span className="achievement-bar-label">
                                    {(achievementPercentages.clarity * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="achievement-scale">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div>
                    </div>
                    
                    <p className="metric-description">
                        How clearly ideas are communicated
                    </p>
                </div>

                <div key="confidence" className="metric-item">
                    <div className="metric-header">
                        <h4>Confidence</h4>
                        <div className="metric-scores">
                            <span className="achievement-score">
                                {(achievementPercentages.confidence * 100).toFixed(1)}%
                            </span>
                            <span className="weighted-score">
                                Score: {formatScore(analysisData.confidence)} / {formatScore(weights.confidence)}
                            </span>
                        </div>
                    </div>
                    
                    <div className="achievement-chart">
                        <div className="achievement-bar-container">
                            <div 
                                className="achievement-bar" 
                                style={{
                                    width: `${achievementPercentages.confidence * 100}%`,
                                    backgroundColor: criterionColors.confidence,
                                    '--final-width': `${achievementPercentages.confidence * 100}%`
                                }}
                            >
                                <span className="achievement-bar-label">
                                    {(achievementPercentages.confidence * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="achievement-scale">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div>
                    </div>
                    
                    <p className="metric-description">
                        Level of certainty and assertiveness shown
                    </p>
                </div>

                <div key="engagement" className="metric-item">
                    <div className="metric-header">
                        <h4>Engagement</h4>
                        <div className="metric-scores">
                            <span className="achievement-score">
                                {(achievementPercentages.engagement * 100).toFixed(1)}%
                            </span>
                            <span className="weighted-score">
                                Score: {formatScore(analysisData.engagement)} / {formatScore(weights.engagement)}
                            </span>
                        </div>
                    </div>
                    
                    <div className="achievement-chart">
                        <div className="achievement-bar-container">
                            <div 
                                className="achievement-bar" 
                                style={{
                                    width: `${achievementPercentages.engagement * 100}%`,
                                    backgroundColor: criterionColors.engagement,
                                    '--final-width': `${achievementPercentages.engagement * 100}%`
                                }}
                            >
                                <span className="achievement-bar-label">
                                    {(achievementPercentages.engagement * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="achievement-scale">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div>
                    </div>
                    
                    <p className="metric-description">
                        Level of energy and enthusiasm in responses
                    </p>
                </div>

                <div key="relevance" className="metric-item">
                    <div className="metric-header">
                        <h4>Relevance</h4>
                        <div className="metric-scores">
                            <span className="achievement-score">
                                {(achievementPercentages.relevance * 100).toFixed(1)}%
                            </span>
                            <span className="weighted-score">
                                Score: {formatScore(analysisData.relevance)} / {formatScore(weights.relevance)}
                            </span>
                        </div>
                    </div>
                    
                    <div className="achievement-chart">
                        <div className="achievement-bar-container">
                            <div 
                                className="achievement-bar" 
                                style={{
                                    width: `${achievementPercentages.relevance * 100}%`,
                                    backgroundColor: criterionColors.relevance,
                                    '--final-width': `${achievementPercentages.relevance * 100}%`
                                }}
                            >
                                <span className="achievement-bar-label">
                                    {(achievementPercentages.relevance * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="achievement-scale">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div>
                    </div>
                    
                    <p className="metric-description">
                        How well responses address the questions asked
                    </p>
                </div>
            </div>

            <div className="analysis-interpretation">
                <h3>Analysis Interpretation</h3>
                <ul>
                    {achievementPercentages.relevance < 0.3 && (
                        <li>Candidate's responses need to more directly address the questions asked.</li>
                    )}
                    {achievementPercentages.clarity < 0.3 && (
                        <li>Candidate should work on expressing ideas more clearly and concisely.</li>
                    )}
                    {achievementPercentages.confidence < 0.3 && (
                        <li>Candidate could benefit from more confident delivery of responses.</li>
                    )}
                    {achievementPercentages.engagement < 0.3 && (
                        <li>Candidate's responses lack sufficient energy and enthusiasm.</li>
                    )}
                    {analysisData.totalScore < 0.5 && (
                        <li>Overall performance is below expectations for this position.</li>
                    )}
                    {analysisData.totalScore >= 0.5 && analysisData.totalScore < 0.7 && (
                        <li>Performance is satisfactory with no significant concerns.</li>
                    )}
                    {analysisData.totalScore >= 0.7 && analysisData.totalScore < 0.9 && (
                        <li>Overall performance demonstrates strong interview skills.</li>
                    )}
                    {analysisData.totalScore >= 0.9 && (
                        <li>Exceptional performance with excellent communication skills and job fit.</li>
                    )}
                    {achievementPercentages.relevance >= 0.9 && (
                        <li>Candidate shows outstanding ability to provide highly relevant responses to questions.</li>
                    )}
                    {achievementPercentages.clarity >= 0.9 && (
                        <li>Exceptional clarity in communication with well-structured and articulate responses.</li>
                    )}
                    {achievementPercentages.confidence >= 0.9 && (
                        <li>Demonstrates remarkable confidence and assertiveness throughout the interview.</li>
                    )}
                    {achievementPercentages.engagement >= 0.9 && (
                        <li>Shows excellent engagement and enthusiasm for the position and company.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

const AudioPlayer = ({ audioUrl, transcript, wordTimings, onTimeUpdate, playerId }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [audioStatus, setAudioStatus] = useState("initial");

    const { currentlyPlaying, pauseOthers } = useContext(AudioPlayerContext);

    useEffect(() => {
        if (audioRef.current && isPlaying && currentlyPlaying !== playerId) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, [currentlyPlaying, playerId, isPlaying]);

    useEffect(() => {
        if (!audioUrl) {
            setError("No audio URL provided");
            setLoading(false);
            setAudioStatus("error");
            return;
        }

        setLoading(true);
        setError(null);
        setDuration(0);
        setCurrentTime(0);
        setIsPlaying(false);
        setAudioStatus("loading");

        const testAudio = new Audio();

        const handleTestCanPlay = () => {
            setAudioStatus("ready");
            setLoading(false);
            testAudio.removeEventListener('canplay', handleTestCanPlay);
            testAudio.removeEventListener('error', handleTestError);
        };

        const handleTestError = (e) => {
            let errorMessage = "Audio file could not be loaded";
            if (e.target.error) {
                switch (e.target.error.code) {
                    case 1:
                        errorMessage = "Audio loading aborted";
                        break;
                    case 2:
                        errorMessage = "Network error while loading audio";
                        break;
                    case 3:
                        errorMessage = "Audio decoding error - file might be corrupted or unsupported format";
                        break;
                    case 4:
                        errorMessage = "Audio format not supported by your browser";
                        break;
                    default:
                        errorMessage = `Unknown audio error (${e.target.error.code})`;
                }
            }
            setError(errorMessage);
            setLoading(false);
            setAudioStatus("error");
            testAudio.removeEventListener('canplay', handleTestCanPlay);
            testAudio.removeEventListener('error', handleTestError);
        };

        testAudio.addEventListener('canplay', handleTestCanPlay);
        testAudio.addEventListener('error', handleTestError);

        testAudio.src = audioUrl;
        testAudio.load();

        return () => {
            testAudio.removeEventListener('canplay', handleTestCanPlay);
            testAudio.removeEventListener('error', handleTestError);
            testAudio.src = '';
        };
    }, [audioUrl]);

    useEffect(() => {
        if (audioStatus === "ready" && audioRef.current) {
            const audio = audioRef.current;

            const handleLoadedMetadata = () => {
                setDuration(audio.duration);
            };

            const handleTimeUpdate = () => {
                setCurrentTime(audio.currentTime);
                if (onTimeUpdate) {
                    onTimeUpdate(audio.currentTime);
                }
            };

            const handleEnded = () => {
                setIsPlaying(false);
                setCurrentTime(0);
                if (onTimeUpdate) {
                    onTimeUpdate(0);
                }
            };

            audio.addEventListener('loadedmetadata', handleLoadedMetadata);
            audio.addEventListener('timeupdate', handleTimeUpdate);
            audio.addEventListener('ended', handleEnded);

            return () => {
                audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audio.removeEventListener('timeupdate', handleTimeUpdate);
                audio.removeEventListener('ended', handleEnded);
            };
        }
    }, [audioStatus, onTimeUpdate]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                pauseOthers(playerId);
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        setError("Playback failed - try using the direct download link");
                    });
                }
                setIsPlaying(true);
            }
        }
    };

    const resetPlay = () => {
        if (audioRef.current) {
            pauseOthers(playerId);
            audioRef.current.currentTime = 0;
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    setError("Playback failed - try using the direct download link");
                    setIsPlaying(false);
                });
            }
            setIsPlaying(true);
        }
    };

    const handleProgressChange = (e) => {
        if (audioRef.current) {
            const newTime = parseFloat(e.target.value);
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    if (loading) {
        return (
            <div className="audio-loading">
                Loading audio...
                <button onClick={() => window.open(audioUrl, '_blank')}
                    style={{
                        marginLeft: '10px', background: 'none', border: 'none',
                        color: '#0066cc', cursor: 'pointer', textDecoration: 'underline'
                    }}>
                    Open directly
                </button>
            </div>
        );
    }

    if (error) {
        return (
            <div className="audio-error">
                <div>{error}</div>
                <div style={{ marginTop: '10px' }}>
                    <button onClick={() => window.open(audioUrl, '_blank')}
                        style={{
                            background: '#0066cc', color: 'white', border: 'none',
                            padding: '5px 10px', borderRadius: '4px', cursor: 'pointer'
                        }}>
                        Download audio file
                    </button>
                </div>
                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666' }}>
                    <p>The audio file may be in WAV format, which some browsers have trouble playing directly.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="audio-player">
            <audio ref={audioRef} src={audioUrl} preload="auto" />

            <div className="audio-controls">
                <button className="audio-button" onClick={togglePlay}>
                    {isPlaying ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="6" y="4" width="4" height="16"></rect>
                            <rect x="14" y="4" width="4" height="16"></rect>
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                        </svg>
                    )}
                </button>

                <button className="audio-button" onClick={resetPlay}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="19 20 9 12 19 4 19 20"></polygon>
                        <line x1="5" y1="19" x2="5" y2="5"></line>
                    </svg>
                </button>

                <div className="audio-progress-container">
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime || 0}
                        onChange={handleProgressChange}
                        className="audio-progress"
                    />
                    <div className="audio-time">
                        <span>{formatTime(currentTime || 0)}</span>
                        <span>{formatTime(duration || 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SynchronizedTranscript = ({ transcript, wordTimings, currentTime }) => {
    if (!wordTimings || wordTimings.length === 0) {
        return (
            <div className="transcript-text">
                {transcript}
            </div>
        );
    }

    const highlightedIndices = new Set();
    
    wordTimings.forEach((wordInfo, idx) => {
        const startTime = wordInfo.startTime || 0;
        const endTime = wordInfo.endTime || 0;
        
        if (currentTime >= startTime && currentTime <= endTime) {
            highlightedIndices.add(idx);
        }
    });
    
    return (
        <div className="transcript-text synchronized">
            {wordTimings.map((wordInfo, idx) => (
                <span 
                    key={idx} 
                    className={highlightedIndices.has(idx) ? "highlighted-word" : ""}
                    data-start={wordInfo.startTime}
                    data-end={wordInfo.endTime}
                >
                    {wordInfo.word}{' '}
                </span>
            ))}
        </div>
    );
};

const InterviewResponses = () => {
    const { jobId, candidateId } = useParams();
    const navigate = useNavigate();

    const [responses, setResponses] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [generatingFeedback, setGeneratingFeedback] = useState(false);
    const [candidate, setCandidate] = useState(null);
    const [job, setJob] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [applicationId, setApplicationId] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmActionType, setConfirmActionType] = useState('');
    const [processingAction, setProcessingAction] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [expandedQuestions, setExpandedQuestions] = useState({});
    const [playbackTimes, setPlaybackTimes] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const candidateRes = await fetch(`http://localhost:8000/api/candidates/candidate/${candidateId}`);
                if (!candidateRes.ok) throw new Error("Failed to fetch candidate information");
                const candidateData = await candidateRes.json();
                setCandidate(candidateData);

                const jobRes = await fetch(`http://localhost:8000/api/jobs/${jobId}`);
                if (!jobRes.ok) throw new Error("Failed to fetch job information");
                const jobData = await jobRes.json();
                setJob(jobData);

                const applicationsRes = await fetch(`http://localhost:8000/api/candidates/applicants?jobId=${jobId}`);
                if (!applicationsRes.ok) throw new Error("Failed to fetch applications");
                const applications = await applicationsRes.json();

                const application = applications.find(app => app.candidateId === candidateId);
                if (!application) throw new Error("Application not found");

                setApplicationId(application.applicationId);

                const responsesRes = await fetch(`http://localhost:8000/api/interviews/responses/${application.applicationId}`);
                if (!responsesRes.ok) {
                    if (responsesRes.status === 404) {
                        setResponses(null);
                        setError("No interview responses found for this candidate");
                        setLoading(false);
                        return;
                    }
                    throw new Error("Failed to fetch interview responses");
                }

                const responsesData = await responsesRes.json();
                setResponses(responsesData);

                const questionsRes = await fetch(`http://localhost:8000/api/interview-questions/actual-questions/${application.applicationId}`);
                if (questionsRes.ok) {
                    const questionsData = await questionsRes.json();
                    setQuestions(questionsData.questions || []);
                }

                if (responsesData && responsesData.questions && responsesData.questions.length > 0) {
                    const needsFeedback = responsesData.questions.some(q => !q.AIFeedback);

                    if (needsFeedback) {
                        setGeneratingFeedback(true);
                        await generateAIFeedback(responsesData, application.applicationId);
                    }
                }

                setLoading(false);
            } catch (error) {
                setError(error.message || "An error occurred while fetching data");
                setLoading(false);
            }
        };

        fetchData();
    }, [jobId, candidateId]);

    useEffect(() => {
        if (responses && responses.questions && responses.questions.length > 0) {
            const initialExpandedState = {};
            responses.questions.forEach((_, index) => {
                initialExpandedState[index] = true;
            });
            setExpandedQuestions(initialExpandedState);
        }
    }, [responses]);

    const toggleQuestionExpansion = (index) => {
        setExpandedQuestions(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const generateAIFeedback = async (responsesData, appId) => {
        try {
            const responsesNeedingFeedback = responsesData.questions
                .filter(q => !q.AIFeedback)
                .map(q => ({
                    questionId: q.questionId,
                    responseId: q.responseId,
                    transcript: q.transcript || ''
                }));

            if (responsesNeedingFeedback.length === 0) {
                setGeneratingFeedback(false);
                return;
            }

            const questionsWithText = responsesNeedingFeedback.map(response => {
                const questionText = questions.find(q => q.questionId === response.questionId)?.text || 'Unknown question';
                return {
                    ...response,
                    questionText
                };
            });

            const feedbackRes = await fetch('http://localhost:8000/api/interviews/generate-feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    applicationId: appId,
                    responses: questionsWithText,
                    jobTitle: job?.jobTitle || 'Unknown position'
                })
            });

            if (!feedbackRes.ok) {
                throw new Error("Failed to generate AI feedback");
            }

            const feedbackData = await feedbackRes.json();

            const updatedResponses = {
                ...responsesData,
                questions: responsesData.questions.map(q => {
                    const feedback = feedbackData.feedback.find(f => f.responseId === q.responseId);
                    return feedback ? { ...q, AIFeedback: feedback.feedback } : q;
                })
            };

            setResponses(updatedResponses);

            await fetch(`http://localhost:8000/api/interviews/update-responses/${appId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedResponses)
            });

        } catch (error) {
            console.error("Error generating AI feedback:", error);
        } finally {
            setGeneratingFeedback(false);
        }
    };

    const handleSendEmail = (type) => {
        setConfirmActionType(type);
        setShowConfirmModal(true);
    };

    const handleConfirmAction = async () => {
        setShowConfirmModal(false);
        setProcessingAction(true);

        try {
            const endpoint = confirmActionType === 'approve'
                ? 'http://localhost:8000/api/interviews/send-offer'
                : 'http://localhost:8000/api/interviews/send-rejection';

            const email = candidate?.extractedText?.applicant_mail || '';

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    applicationId,
                    candidateId,
                    jobId,
                    email,
                    candidateName: candidate?.extractedText?.applicant_name || 'Candidate',
                    jobTitle: job?.jobTitle || 'the position'
                })
            });

            if (!response.ok) {
                throw new Error(`Failed to send ${confirmActionType === 'approve' ? 'offer' : 'rejection'} email`);
            }

            setModalMessage(
                confirmActionType === 'approve'
                    ? 'Job offer email has been sent successfully!'
                    : 'Rejection email has been sent successfully!'
            );
            setShowSuccessModal(true);

            const newStatus = confirmActionType === 'approve' ? 'approved' : 'rejected';
            await fetch(`http://localhost:8000/api/candidates/update-status/${applicationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

        } catch (error) {
            setModalMessage(`Error: ${error.message}`);
            setShowSuccessModal(true);
        } finally {
            setProcessingAction(false);
        }
    };

    const handleCancelAction = () => {
        setShowConfirmModal(false);
    };

    const getQuestionText = (questionId) => {
        const question = questions.find(q => q.questionId === questionId);
        return question ? question.text : 'Unknown question';
    };

    const handleAudioTimeUpdate = (responseId, time) => {
        setPlaybackTimes(prev => ({
            ...prev,
            [responseId]: time
        }));
    };

    const handleBackToCandidateProfile = () => {
        setLoading(true);
        navigate(`/dashboard/${jobId}/${candidateId}`, {
            state: { 
                directToJobDetails: true,
                jobId: jobId
            }
        });
    };

    const handleBackToJobDetails = () => {
        setLoading(true);
        navigate(`/dashboard`, {
            state: { 
                directToJobDetails: true, 
                jobId: jobId,
                skipJobList: true
            },
            replace: true
        });
    };

    const SuccessModal = () => (
        <div className="status-modal-overlay">
            <div className="status-modal">
                <div className={`status-icon ${modalMessage.includes('Error') ? 'error-icon' : 'success-icon'}`}>
                    {modalMessage.includes('Error') ? (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                        </svg>
                    ) : (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    )}
                </div>
                <h3 className="status-title">{modalMessage.includes('Error') ? 'Error' : 'Success'}</h3>
                <p className="status-description">{modalMessage}</p>
                <div className="status-buttons">
                    <button className="status-button primary-button" onClick={() => setShowSuccessModal(false)}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );

    const ConfirmModal = () => (
        <div className="status-modal-overlay">
            <div className="status-modal">
                <div className="status-icon warning-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                </div>
                <h3 className="status-title">Confirm Action</h3>
                <p className="status-description">
                    {confirmActionType === 'approve'
                        ? 'Are you sure you want to send a job offer email to this candidate?'
                        : 'Are you sure you want to send a rejection email to this candidate?'}
                </p>
                <div className="status-buttons">
                    <button className="status-button secondary-button" onClick={handleCancelAction}>
                        Cancel
                    </button>
                    <button className="status-button primary-button" onClick={handleConfirmAction}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading || processingAction) {
        return (
            <div className="interview-responses-container" style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '80vh'
            }}>
                <div className="loading-indicator" style={{ textAlign: 'center' }}>
                    <LoadingAnimation />
                    <p style={{ marginTop: '20px' }}>
                        {processingAction ? 'Processing your request...' : 'Loading interview responses...'}
                    </p>
                </div>
            </div>
        );
    }

    if (error && !responses) {
        return (
            <div className="interview-responses-container">
                <div className="error-container">
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                    </svg>
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button className="back-button" onClick={() => navigate(`/dashboard/${jobId}/${candidateId}`)}>
                        Return to Candidate Profile
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AudioPlayerProvider>
            <div className="interview-responses-container">
                {showSuccessModal && <SuccessModal />}
                {showConfirmModal && <ConfirmModal />}

                <button className="back-button" onClick={handleBackToJobDetails}>
                    <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Job Details
                </button>

                <div className="responses-header">
                    <h1>Interview Responses</h1>
                    <div className="candidate-info">
                        <span className="candidate-id">Candidate ID: {candidateId}</span>
                        {job && <span className="job-title">Position: {job.jobTitle}</span>}
                    </div>
                </div>

                {responses && responses.analysis && (
                    <PerformanceAnalysis analysis={responses.analysis} />
                )}

                {generatingFeedback && (
                    <div className="generating-feedback-banner">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                            <polyline points="17 8 12 3 7 8"></polyline>
                            <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                        <span>Generating AI feedback on responses...</span>
                    </div>
                )}

                <div className="response-list">
                    {responses && responses.questions && responses.questions.length > 0 ? (
                        responses.questions.map((response, index) => (
                            <div
                                key={response.responseId}
                                className={`response-card ${expandedQuestions[index] ? 'expanded' : 'collapsed'}`}
                            >
                                <div
                                    className="question-header"
                                    onClick={() => toggleQuestionExpansion(index)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <div
                                            className="question-icon"
                                            style={{
                                                backgroundColor: '#4caf50',
                                                color: 'white',
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                marginRight: '12px',
                                                flexShrink: 0
                                            }}
                                        >
                                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Q{index + 1}</span>
                                        </div>
                                        <h3
                                            style={{
                                                color: '#333',
                                                fontSize: '1.2rem',
                                                lineHeight: '1.5',
                                                margin: 0,
                                                fontWeight: '600'
                                            }}
                                        >
                                            {getQuestionText(response.questionId)}
                                        </h3>

                                        <div className="toggle-indicator">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                {expandedQuestions[index] ? (
                                                    <polyline points="18 15 12 9 6 15"></polyline>
                                                ) : (
                                                    <polyline points="6 9 12 15 18 9"></polyline>
                                                )}
                                            </svg>
                                        </div>
                                    </div>
                                    {response.wordCount > 0 && (
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: '#666',
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginLeft: '48px'
                                        }}>
                                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                    strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                                                </svg>
                                                Response length: {response.wordCount} words
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="question-content">
                                    {(response.modifiedAudioUrl || response.audioExtractUrl) && (
                                        <div className="audio-section" style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{
                                                color: '#4a5568',
                                                marginBottom: '0.75rem',
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                                </svg>
                                                Candidate's Response:
                                            </h4>
                                            <AudioPlayer 
                                                audioUrl={response.modifiedAudioUrl || response.audioExtractUrl} 
                                                transcript={response.transcript}
                                                wordTimings={response.wordTimings}
                                                onTimeUpdate={(time) => handleAudioTimeUpdate(response.responseId, time)}
                                                playerId={response.responseId}
                                            />

                                            <div style={{
                                                marginTop: '15px',
                                                fontSize: '0.9rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }}>
                                                <div>
                                                    <strong>Having trouble playing the audio?</strong>
                                                </div>
                                                <div>
                                                    <a
                                                        href={response.modifiedAudioUrl || response.audioExtractUrl}
                                                        download={`response-${index + 1}.wav`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            display: 'inline-block',
                                                            backgroundColor: '#4caf50',
                                                            color: 'white',
                                                            padding: '6px 12px',
                                                            borderRadius: '4px',
                                                            textDecoration: 'none',
                                                            fontSize: '0.9rem'
                                                        }}
                                                    >
                                                        <svg
                                                            style={{ verticalAlign: 'middle', marginRight: '5px' }}
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                            <polyline points="7 10 12 15 17 10"></polyline>
                                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                                        </svg>
                                                        Download Audio
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {response.transcript && (
                                        <div className="transcript-section" style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{
                                                color: '#4a5568',
                                                marginBottom: '0.75rem',
                                                fontSize: '1rem',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                    <polyline points="14 2 14 8 20 8"></polyline>
                                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                                    <polyline points="10 9 9 9 8 9"></polyline>
                                                </svg>
                                                Transcript:
                                            </h4>
                                            <SynchronizedTranscript 
                                                transcript={response.transcript}
                                                wordTimings={response.wordTimings || []}
                                                currentTime={playbackTimes[response.responseId] || 0}
                                            />
                                        </div>
                                    )}

                                    <div className="feedback-section" style={{ marginTop: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.75rem' }}>
                                            <div
                                                style={{
                                                    backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                                    color: '#4caf50',
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    marginRight: '10px',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                                                    strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                                                </svg>
                                            </div>
                                            <h4 style={{ color: '#4a5568', margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                                                AI Feedback
                                            </h4>
                                        </div>

                                        <div className="feedback-content" style={{
                                            backgroundColor: 'rgba(76, 175, 80, 0.05)',
                                            borderLeft: '3px solid #4caf50',
                                            borderRadius: '0 4px 4px 0',
                                            padding: '1.25rem',
                                            marginLeft: '16px'
                                        }}>
                                            {response.AIFeedback ? (
                                                <div
                                                    className="ai-feedback-text"
                                                    style={{ color: '#333', lineHeight: '1.6' }}
                                                    dangerouslySetInnerHTML={{ __html: response.AIFeedback }}
                                                />
                                            ) : (
                                                <div className="feedback-loading" style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: '1rem',
                                                    color: '#718096',
                                                    fontStyle: 'italic'
                                                }}>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                                        style={{ marginRight: '8px', animation: 'spin 2s linear infinite' }}>
                                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                                    </svg>
                                                    <p style={{ margin: 0 }}>Generating feedback...</p>
                                                    <style>{`
                                                        @keyframes spin {
                                                            to { transform: rotate(360deg); }
                                                        }
                                                    `}</style>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-responses">
                            <p>No interview responses found for this candidate.</p>
                        </div>
                    )}
                </div>

                <div className="action-buttons">
                    <button
                        className="reject-button"
                        onClick={() => handleSendEmail('reject')}
                    >
                        Send Rejection Email
                    </button>
                    <button
                        className="approve-button"
                        onClick={() => handleSendEmail('approve')}
                    >
                        Send Job Offer Email
                    </button>
                </div>
            </div>
        </AudioPlayerProvider>
    );
};

export default InterviewResponses;