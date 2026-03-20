import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ChevronRight, Home, Calendar, History, User, MapPin, Camera, Wifi, Folder, ArrowRight, Send, Video, Phone, X, Shield, Sparkles, Check, Clock, Plus } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './index.css';

// Assets
import logo from './assets/logo.png';
import medicalCheckup from './assets/medical-checkup.png';
import findDoctor from './assets/find-doctor.png';
import bookAppointment from './assets/book-appointment.png';
import moreServices from './assets/more-services.png';
import articleHeart from './assets/article-heart.png';
import healthTracker from './assets/health-tracker.png';
import bmiIcon from './assets/bmi.png';
import onboardingImg from './assets/onboarding.png';

// Gemini Config
const API_KEY = "AIzaSyBogShSC8EUszgklDUb0_hC_uu7XQD-9L8";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const PermissionsScreen = ({ onContinue }) => {
  const permissions = [
    {
      icon: <MapPin size={24} />,
      title: "Location",
      desc: "MyCare by Mayapada Hospital collects location data to enable nearby hospital units at Emergency menu"
    },
    {
      icon: <Camera size={24} />,
      title: "Camera",
      desc: "MyCare by Mayapada Hospital collect images from camera at Book Appointment, Book MCU, Covid-19 Testing, Edit Profile for sending images"
    },
    {
      icon: <Wifi size={24} />,
      title: "Internet Connection and Network",
      desc: "MyCare by Mayapada Hospital use your internet connection and network for running services in application"
    },
    {
      icon: <Folder size={24} />,
      title: "Storage & Media",
      desc: "MyCare by Mayapada Hospital collect images or files from Storage & Media at Book Appointment, Book MCU, Covid-19 Testing, Edit Profile for sending images or files"
    }
  ];

  return (
    <motion.div 
      className="permissions-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="permissions-header">
        <img src={logo} alt="My Care" className="logo" />
      </div>
      
      <motion.div 
        className="permissions-card"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2>Hello Maya Friend</h2>
        <p className="permissions-subtitle">
          To provide you with the best experience in Mayapada Hospital app, we need some access
        </p>

        <div className="permissions-list">
          {permissions.map((item, index) => (
            <div key={index} className="permission-item">
              <div className="permission-icon">
                {item.icon}
              </div>
              <div className="permission-content">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="btn-allow" onClick={onContinue}>
          Allow & Continue
        </button>
      </motion.div>
    </motion.div>
  );
};

const OnboardingFlow = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  
  const slides = [
    {
      title: "Easier To Make an Appointment",
      desc: "Find a doctor and make an appointment at Mayapada Hospitals with just a few clicks"
    },
    {
      title: "Monitor Your Health",
      desc: "Record and monitor your exercise, diet, weight, symptoms, medications and blood sugar level"
    },
    {
      title: "Healthy With Us",
      desc: "Get the latest health information and tips to improve your quality of life."
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
    }
  };

  return (
    <motion.div 
      className="onboarding-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="onboarding-header">
        <img src={logo} alt="My Care" className="logo" />
        <button className="btn-skip" onClick={onFinish}>Skip</button>
      </div>

      <div className="onboarding-illustration">
        <img src={onboardingImg} alt="Medical Team" />
      </div>

      <motion.div 
        key={currentSlide}
        className="onboarding-card"
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
      >
        <h2>{slides[currentSlide].title}</h2>
        <p>{slides[currentSlide].desc}</p>

        <div className="onboarding-footer">
          <div className="progress-dots">
            {slides.map((_, i) => (
              <span key={i} className={`dot ${i === currentSlide ? 'active' : ''}`}></span>
            ))}
          </div>
          <button className="btn-next" onClick={handleNext}>
            <ArrowRight size={24} color="white" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const AITriage = ({ onBack, onStartVideo }) => {
  const [messages, setMessages] = React.useState([
    { role: 'ai', text: "Hello! I am MyCare AI Assistant. Please tell me what symptoms you are feeling today, and I will help you find the right specialist." }
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const chatEndRef = React.useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await model.generateContent([
        "You are a medical triage assistant for Mayapada Hospital. Analyze these symptoms and provide 3 things: 1. Potential initial diagnosis (disclaimer needed), 2. Recommended specialist at Mayapada Hospital, 3. Urgency level. Keep it professional and empathetic. Input: " + input
      ]);
      const response = await result.response;
      const aiText = response.text();
      
      setMessages(prev => [...prev, { role: 'ai', text: aiText, hasAction: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm sorry, I'm having trouble connecting to my medical database. Please try again or call our emergency line." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-triage-screen">
      <header className="ai-header">
        <button className="btn-icon" onClick={onBack}><X size={24} /></button>
        <div className="ai-title">
          <Sparkles size={20} className="sparkle-icon" />
          <span>MyCare AI 2.0 - Chat</span>
        </div>
        <div style={{ width: 24 }}></div>
      </header>

      <div className="chat-area">
        {messages.map((m, i) => (
          <motion.div 
            key={i} 
            className={`chat-bubble ${m.role}`}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            {m.text}
            {m.hasAction && (
              <button className="btn-video-consult" onClick={onStartVideo}>
                <Video size={18} />
                Start Instant Video Consultation
              </button>
            )}
          </motion.div>
        ))}
        {loading && (
          <div className="chat-bubble ai loading">
            <span className="dot-pulse"></span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-area">
        <input 
          type="text" 
          placeholder="Describe your symptoms..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="btn-send" onClick={handleSend} disabled={loading}>
          <Send size={24} color="white" />
        </button>
      </div>
    </div>
  );
};

const AIVoiceCall = ({ onBack, onStartVideo }) => {
  const [pulse, setPulse] = React.useState(1);
  const [transcript, setTranscript] = React.useState("Listening to your symptoms...");
  const [isAIResponding, setIsAIResponding] = React.useState(false);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => p === 1 ? 1.2 : 1);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const simulateAISpeech = () => {
    setIsAIResponding(true);
    setTranscript("Analyzing symptoms... I recommend consulting a Cardiologist. Would you like to start a video call now?");
    setTimeout(() => {
      // Show action in speech or just UI
    }, 2000);
  };

  return (
    <motion.div 
      className="ai-voice-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="ai-header transparent">
        <button className="btn-icon white" onClick={onBack}><X size={24} /></button>
        <div className="ai-title white">MyCare AI Voice</div>
        <div style={{ width: 24 }}></div>
      </header>

      <div className="voice-main">
        <motion.div 
          className="voice-pulse-outer"
          animate={{ scale: pulse }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div className="voice-pulse-inner">
            <Sparkles size={60} color="white" />
          </motion.div>
        </motion.div>

        <div className="voice-transcript">
          <p>{transcript}</p>
        </div>
      </div>

      <div className="voice-controls">
        <button className="control-btn mic active"><Phone size={24} /></button>
        {transcript.includes("recommend") ? (
          <button className="btn-action-voice" onClick={onStartVideo}>
            <Video size={20} />
            Connect to Specialist
          </button>
        ) : (
          <button className="control-btn speak" onClick={simulateAISpeech}>
            <Send size={24} />
          </button>
        )}
        <button className="control-btn end" onClick={onBack}><Phone size={24} className="rotate-end" /></button>
      </div>
    </motion.div>
  );
};

const VideoConsultation = ({ onEnd }) => {
  const [showChat, setShowChat] = React.useState(false);
  const [showRecords, setShowRecords] = React.useState(false);

  return (
    <motion.div 
      className="video-consult-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="video-main">
        <div className="doctor-feed">
          <div className="doctor-avatar">
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" alt="Doctor" />
          </div>
          <div className="doctor-info">
            <h3>Dr. Maya Specialized</h3>
            <p className="status-online">● Online | Cardiovascular Center</p>
          </div>
        </div>
        
        <motion.div 
          className="user-feed"
          drag
          dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <User size={40} color="white" />
        </motion.div>

        <AnimatePresence>
          {showRecords && (
            <motion.div 
              className="medical-records-overlay"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
            >
              <div className="overlay-header">
                <h4>Medical Records</h4>
                <button onClick={() => setShowRecords(false)}><X size={20} /></button>
              </div>
              <div className="record-item">
                <span>Blood Type</span>
                <strong>O+</strong>
              </div>
              <div className="record-item">
                <span>Allergies</span>
                <strong>Penicillin, Pollen</strong>
              </div>
              <div className="record-item">
                <span>Last Visit</span>
                <strong>12 Jan 2026</strong>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showChat && (
            <motion.div 
              className="video-chat-overlay"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
            >
              <div className="overlay-header">
                <h4>Consultation Chat</h4>
                <button onClick={() => setShowChat(false)}><X size={20} /></button>
              </div>
              <div className="chat-messages-mini">
                <div className="msg-mini dr">Hello! How can I help you?</div>
                <div className="msg-mini user">I'm feeling chest pain...</div>
              </div>
              <div className="chat-input-mini">
                <input type="text" placeholder="Type message..." />
                <Send size={18} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="video-controls-v2">
        <button className={`tool-btn ${showChat ? 'active' : ''}`} onClick={() => { setShowChat(!showChat); setShowRecords(false); }}>
          <History size={24} />
          <span>Chat</span>
        </button>
        <button className={`tool-btn ${showRecords ? 'active' : ''}`} onClick={() => { setShowRecords(!showRecords); setShowChat(false); }}>
          <Folder size={24} />
          <span>Records</span>
        </button>
        <button className="control-btn-v2 mic"><Phone size={24} /></button>
        <button className="control-btn-v2 video"><Video size={24} /></button>
        <button className="control-btn-v2 end" onClick={onEnd}><Phone size={24} className="rotate-end" /></button>
      </div>
      
      <div className="encryption-tip">
        <Shield size={12} />
        <span>Secure end-to-end encrypted connection</span>
      </div>
    </motion.div>
  );
};

const AIInteractionSelection = ({ onSelectChat, onSelectVoice, onBack }) => {
  return (
    <motion.div
      className="ai-selection-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <header className="ai-header">
        <button className="btn-icon" onClick={onBack}><X size={24} /></button>
        <div className="ai-title">
          <Sparkles size={20} className="sparkle-icon" />
          <span>MyCare AI 2.0</span>
        </div>
        <div style={{ width: 24 }}></div>
      </header>

      <div className="selection-content">
        <h2>How would you like to interact with MyCare AI?</h2>
        <p>Choose your preferred method for symptom analysis and specialist recommendations.</p>

        <motion.button
          className="selection-option"
          whileTap={{ scale: 0.98 }}
          onClick={onSelectChat}
        >
          <Send size={32} />
          <div className="option-text">
            <h3>Chat with AI</h3>
            <p>Type your symptoms and get text-based recommendations.</p>
          </div>
          <ChevronRight size={24} />
        </motion.button>

        <motion.button
          className="selection-option"
          whileTap={{ scale: 0.98 }}
          onClick={onSelectVoice}
        >
          <Phone size={32} />
          <div className="option-text">
            <h3>Voice Call with AI</h3>
            <p>Speak your symptoms and receive verbal guidance.</p>
          </div>
          <ChevronRight size={24} />
        </motion.button>
      </div>
    </motion.div>
  );
};


const PostDischargeMonitoring = ({ onBack }) => {
  const [vitals, setVitals] = React.useState({ bp: '120/80', hr: '72', spo2: '98' });
  const [isSyncing, setIsSyncing] = React.useState(false);

  const medications = [
    { name: 'Amlodipine 5mg', time: '08:00 AM', taken: true },
    { name: 'Atorvastatin 20mg', time: '09:00 PM', taken: false },
    { name: 'Clopidogrel 75mg', time: '08:00 AM', taken: true }
  ];

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setVitals({ bp: '118/79', hr: '68', spo2: '99' });
    }, 2000);
  };

  return (
    <motion.div className="monitoring-screen" initial={{ x: '100%' }} animate={{ x: 0 }}>
      <header className="ai-header">
        <button className="btn-icon" onClick={onBack}><X size={24} /></button>
        <div className="ai-title">Remote Monitoring</div>
        <div style={{ width: 24 }}></div>
      </header>

      <div className="monitoring-content">
        {/* AI Health Alert Card */}
        <motion.div 
          className="health-alert-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="alert-header">
            <Sparkles size={18} color="#0d9488" />
            <span>AI Health Insight</span>
          </div>
          <p>Your recovery is progressing well. Heart rate is stable. Keep maintaining your hydration and light activity levels.</p>
        </motion.div>

        {/* Vitals Grid */}
        <section className="vitals-section">
          <div className="section-header">
            <h3>Vital Signs</h3>
            <button className={`sync-btn ${isSyncing ? 'syncing' : ''}`} onClick={handleSync}>
              <Wifi size={16} /> {isSyncing ? 'Syncing...' : 'Sync Fit'}
            </button>
          </div>
          <div className="vitals-grid">
            <div className="vital-card">
              <span className="label">Blood Pressure</span>
              <span className="value">{vitals.bp}</span>
              <span className="unit">mmHg</span>
            </div>
            <div className="vital-card">
              <span className="label">Heart Rate</span>
              <span className="value">{vitals.hr}</span>
              <span className="unit">bpm</span>
            </div>
            <div className="vital-card">
              <span className="label">SpO2</span>
              <span className="value">{vitals.spo2}</span>
              <span className="unit">%</span>
            </div>
          </div>
        </section>

        {/* Medication Reminders */}
        <section className="medication-section">
          <h3>Daily Medications</h3>
          <div className="med-list">
            {medications.map((med, i) => (
              <div key={i} className={`med-item ${med.taken ? 'done' : ''}`}>
                <div className="med-info">
                  <strong>{med.name}</strong>
                  <span>{med.time}</span>
                </div>
                {med.taken ? (
                  <div className="med-status done"><Check size={18} /></div>
                ) : (
                  <button className="med-status-btn">Take</button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Discharge Summary */}
        <section className="summary-section">
          <div className="doc-item">
            <Folder size={20} color="#64748b" />
            <div className="doc-info">
              <strong>Post-Discharge Protocol</strong>
              <span>Last updated: Yesterday</span>
            </div>
            <ChevronRight size={18} color="#cbd5e1" />
          </div>
        </section>
      </div>
    </motion.div>
  );
};


const MACConsultation = ({ onBack }) => {
  const [subStep, setSubStep] = React.useState('intro'); // intro, form, timeline, video
  const [stage, setStage] = React.useState(1); // 1: Submit, 2: Mayapada, 3: Apollo, 4: Conference

  const steps = [
    { label: 'Submit Case', status: stage > 1 ? 'done' : stage === 1 ? 'current' : 'pending' },
    { label: 'Mayapada Review', status: stage > 2 ? 'done' : stage === 2 ? 'current' : 'pending' },
    { label: 'Apollo Desk India', status: stage > 3 ? 'done' : stage === 3 ? 'current' : 'pending' },
    { label: '3-Way Conference', status: stage > 4 ? 'done' : stage === 4 ? 'current' : 'pending' }
  ];

  const handleNextStage = () => {
    if (stage < 4) setStage(stage + 1);
  };

  if (subStep === 'video') {
    return (
      <motion.div className="macc-video-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="three-way-video">
          <div className="video-panel apollo">
            <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop" alt="Apollo Specialist" />
            <div className="label">Dr. Rajesh Patel - Apollo India</div>
          </div>
          <div className="video-panel mayapada">
            <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" alt="Mayapada Dr" />
            <div className="label">Dr. Maya Specialized - Mayapada</div>
          </div>
          <div className="video-panel patient">
            <User size={80} color="white" />
            <div className="label">You (Patient)</div>
          </div>
        </div>
        <div className="macc-controls">
          <button className="control-btn mic"><Phone size={24} /></button>
          <button className="control-btn video"><Video size={24} /></button>
          <button className="control-btn end" onClick={() => setSubStep('timeline')}><Phone size={24} className="rotate-end" /></button>
        </div>
        <div className="macc-info">
          <div className="apollo-logo-mini">Apollo <span>Hospitals</span></div>
          <Shield size={12} /> Secure Co-Consultation
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="macc-screen" initial={{ x: '100%' }} animate={{ x: 0 }}>
      <header className="ai-header">
        <button className="btn-icon" onClick={onBack}><X size={24} /></button>
        <div className="ai-title macc">
          <span>Mayapada-Apollo Co-Consultation</span>
        </div>
        <div style={{ width: 24 }}></div>
      </header>

      <div className="macc-content">
        <AnimatePresence mode="wait">
          {subStep === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="macc-intro"
            >
              <div className="macc-hero-card">
                <div className="logos">
                  <img src={logo} alt="Mayapada" className="m-logo" />
                  <div className="plus">+</div>
                  <div className="apollo-logo">Apollo <span>Hospitals</span></div>
                </div>
                <h2>World-Class Second Opinion</h2>
                <p>Get your medical case reviewed by sub-specialists from Apollo Hospitals India in collaboration with Mayapada specialists.</p>
              </div>

              <div className="macc-features">
                <div className="feature-item">
                  <Clock size={24} color="#0072bc" />
                  <div>
                    <h4>Fast Response (48 - 72h)</h4>
                    <p>Rapid review for time-sensitive medical conditions</p>
                  </div>
                </div>
                <div className="feature-item">
                  <Video size={24} color="#0072bc" />
                  <div>
                    <h4>Collaborative Care</h4>
                    <p>Live discussion with multi-disciplinary specialist teams</p>
                  </div>
                </div>
              </div>

              <button className="btn-primary macc-start" onClick={() => setSubStep('form')}>
                Start My Case Submission
              </button>
            </motion.div>
          )}

          {subStep === 'form' && (
            <motion.div 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="macc-form"
            >
              <h3>Tell us about your case</h3>
              <p>Your history will be summarized by our specialists for the Apollo team.</p>
              <textarea placeholder="e.g. Chronic chest pain for 3 months, history of hypertension..." rows="8"></textarea>
              <motion.div 
                className="file-upload-dummy"
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={24} />
                <span>Add Medical Records / Lab Results</span>
              </motion.div>
              <button className="btn-primary" onClick={() => { setStage(2); setSubStep('timeline'); }}>
                Process Case with Mayapada
              </button>
            </motion.div>
          )}

          {subStep === 'timeline' && (
            <motion.div 
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="macc-timeline"
            >
              <h3>MACC Tracking ID: #MP-AP-2026</h3>
              <div className="timeline-container">
                {steps.map((s, i) => (
                  <motion.div 
                    key={i} 
                    className={`timeline-step ${s.status}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="step-circle">
                      {s.status === 'done' ? <Check size={16} /> : <span>{i + 1}</span>}
                    </div>
                    <div className="step-label">
                      <strong>{s.label}</strong>
                      <p>
                        {s.status === 'current' 
                          ? i === 1 ? 'Specialist reviewing documentation...' 
                            : i === 2 ? 'Apollo India desk processing assignment...' 
                            : i === 3 ? 'Ready for multi-disciplinary meeting.'
                            : 'Awaiting submission...'
                          : s.status === 'done' ? 'Stage completed successfully' 
                          : 'Awaiting previous stages'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {stage >= 2 && (
                <motion.div 
                  className="timeline-action-card"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="stage-info">
                    {stage === 2 && <p>Our Indonesian specialists are distilling your records for the Apollo clinical desk in India.</p>}
                    {stage === 3 && <p>Apollo Hospitals India has acknowledged your case. Determining the best sub-specialist.</p>}
                    {stage === 4 && <p>All specialists are ready. You can now join the 3-way conference call.</p>}
                  </div>

                  <div className="time-estimate">
                    <Clock size={16} />
                    <span>{stage === 4 ? 'Status: READY' : 'Next update in approx. 12-24 hours'}</span>
                  </div>
                  
                  {stage < 4 ? (
                    <button className="btn-secondary-outline" onClick={handleNextStage}>
                      [Demo] Advance to Next Stage
                    </button>
                  ) : (
                    <button className="btn-primary" style={{ marginTop: 16 }} onClick={() => setSubStep('video')}>
                      Join 3-Way Video Conference
                    </button>
                  ) }
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};


const App = () => {
  const [step, setStep] = React.useState('home'); // HIDE (onboarding/permissions) FOR TESTING
  const [showAISelection, setShowAISelection] = React.useState(false);

  if (step === 'permissions') {
    return <PermissionsScreen onContinue={() => setStep('onboarding')} />;
  }

  if (step === 'onboarding') {
    return <OnboardingFlow onFinish={() => setStep('home')} />;
  }

  if (step === 'ai-triage') {
    return <AITriage onBack={() => setStep('home')} onStartVideo={() => setStep('video-consult')} />;
  }

  if (step === 'ai-voice') {
    return <AIVoiceCall onBack={() => setStep('home')} onStartVideo={() => setStep('video-consult')} />;
  }

  if (step === 'video-consult') {
    return <VideoConsultation onEnd={() => setStep('home')} />;
  }

  if (step === 'macc') {
    return <MACConsultation onBack={() => setStep('home')} />;
  }

  if (step === 'post-discharge') {
    return <PostDischargeMonitoring onBack={() => setStep('home')} />;
  }

  return (
    <div className="app-container animate-fade-in">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <img src={logo} alt="My Care" className="logo" />
          <div className="notification-wrapper">
            <Bell size={24} color="white" />
            <span className="notification-dot"></span>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* MyCare AI 2.0 Banner */}
        <div className="ai-banner-wrapper">
          <motion.section 
            className="ai-banner"
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAISelection(!showAISelection)}
          >
            <div className="ai-banner-content">
              <div className="ai-badge">NEW</div>
              <h3>MyCare AI 2.0</h3>
              <p>Try Voice or Chat for faster Triage</p>
            </div>
            <Sparkles className="sparkle-float" color="white" size={32} />
          </motion.section>

          <AnimatePresence>
            {showAISelection && (
              <motion.div 
                className="ai-selection-overlay"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <button onClick={() => { setStep('ai-triage'); setShowAISelection(false); }}>
                  <Send size={20} /> Chat with AI
                </button>
                <div className="divider-h"></div>
                <button onClick={() => { setStep('ai-voice'); setShowAISelection(false); }}>
                  <Phone size={20} /> Voice Call AI
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* MACC Banner */}
        <section className="macc-banner">
          <div className="macc-banner-bg"></div>
          <div className="macc-banner-inner" onClick={() => setStep('macc')}>
            <div className="macc-col">
              <div className="macc-badge">EXCLUSIVE</div>
              <div className="apollo-logo-v2">Apollo <span>Hospitals</span></div>
              <h3>Co-Consultation</h3>
              <p>India's best specialists collaborate with Mayapada</p>
            </div>
            <ChevronRight size={24} color="#0072bc" />
          </div>
        </section>

        {/* Greeting Section */}
        <section className="greeting-card">
          <h2>Hello, Good Evening</h2>
          
          <div className="quick-actions">
            <section className="services-grid">
          <div className="service-card" onClick={() => setStep('post-discharge')}>
            <div className="service-icon monitoring">
              <Wifi size={24} color="#0d9488" />
            </div>
            <span>Remote Monitoring</span>
          </div>
          <div className="service-card">
            <div className="service-icon doctor">
              <img src={medicalCheckup} alt="Medical Checkup" />
            </div>
            <span>Medical Checkup</span>
          </div>
          </section>
            <motion.div className="action-item" whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
              <div className="icon-circle">
                <img src={findDoctor} alt="Find Doctor" />
              </div>
              <span>Find Doctor</span>
            </motion.div>
            <motion.div className="action-item" whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
              <div className="icon-circle">
                <img src={bookAppointment} alt="Book Appointment" />
              </div>
              <span>Book Appointment</span>
            </motion.div>
            <motion.div className="action-item" whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
              <div className="icon-circle">
                <img src={moreServices} alt="More Service" />
              </div>
              <span>More Service</span>
            </motion.div>
          </div>
        </section>

        {/* Sync Data Banner */}
        <motion.section 
          className="sync-banner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="sync-content">
            <h3>Pernah berobat di unit Mayapada Hospital sebelumnya?</h3>
            <p>Lakukan sinkronisasi data pasien agar terhubung ke rekam medis yang sesuai pada sistem kami</p>
            <div className="sync-actions">
              <button className="btn-sync">Sinkron Data</button>
              <button className="btn-close">Tutup Pesan</button>
            </div>
          </div>
        </motion.section>

        {/* Health Articles */}
        <section className="articles-section">
          <div className="section-header">
            <h3>Health Articles and Tips</h3>
            <a href="#" className="see-more">See More</a>
          </div>
          <div className="articles-scroll">
            <div className="article-card">
              <div className="article-image-wrapper">
                <img src={articleHeart} alt="Heart Care" />
                <span className="category-tag">Cardiovascular Center</span>
              </div>
              <div className="article-info">
                <h4>Mengapa Perawatan Penyakit Jantung Terintegrasi Sangat Dib...</h4>
                <p>Penyakit jantung tidak hanya berdampak pada organ jantung, tetapi juga kualitas hidup dan produktivitas sehari-hari.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Personal Health */}
        <section className="personal-health">
          <div className="section-header">
            <h3>Personal Health</h3>
          </div>
          
        <motion.div 
          className="health-card"
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="health-card-icon">
            <img src={healthTracker} alt="Health Tracker" />
          </div>
          <div className="health-card-body">
            <h4>Health Tracker</h4>
            <p>Google Fit lets you view your steps, bl...</p>
          </div>
          <button className="btn-connect">Connect</button>
        </motion.div>
        </section>

        {/* Emergency Call */}
        <section className="emergency-call">
          <div className="emergency-btn">
            <span>Emergency Call</span>
            <ChevronRight size={20} />
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-item active">
          <div className="nav-icon-bg">
            <Home size={24} />
          </div>
          <span>Home</span>
        </div>
        <div className="nav-item">
          <div className="nav-icon-bg">
            <Calendar size={24} />
          </div>
          <span>Booking</span>
        </div>
        <div className="nav-item">
          <div className="nav-icon-bg">
            <History size={24} />
          </div>
          <span>History</span>
        </div>
        <div className="nav-item">
          <div className="nav-icon-bg">
            <User size={24} />
          </div>
          <span>Profile</span>
        </div>
      </nav>
    </div>
  );
};

export default App;
