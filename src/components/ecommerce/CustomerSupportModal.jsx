import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { HelpCircle, Send, MessageSquare, Plus, CheckCircle, AlertCircle, X, Shield } from 'lucide-react';

export const CustomerSupportModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { success, error: toastError } = useToast();

  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets', 'new', 'chat'
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);

  // New ticket form state (Controlled form)
  const [newSubject, setNewSubject] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newMessage, setNewMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Chat reply state
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const fetchTickets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.support.getMyTickets();
      setTickets(res.tickets || []);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetails = async (id) => {
    try {
      const res = await api.support.getTicketDetails(id);
      setSelectedTicket(res.ticket);
      setActiveTab('chat');
    } catch (err) {
      toastError('Failed to load ticket conversation: ' + err.message);
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      fetchTickets();
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) {
      toastError('Subject and message description are required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.support.createTicket({
        subject: newSubject,
        priority: newPriority,
        message: newMessage
      });

      success('Support ticket submitted! Our CRM team has been notified.');
      setNewSubject('');
      setNewMessage('');
      await fetchTickets();
      if (res.ticket?.id) {
        await fetchTicketDetails(res.ticket.id);
      } else {
        setActiveTab('tickets');
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setSendingReply(true);
    try {
      await api.support.addMessage(selectedTicket.id, replyText.trim());
      setReplyText('');
      await fetchTicketDetails(selectedTicket.id);
      success('Reply sent!');
    } catch (err) {
      toastError(err.message || 'Failed to send reply.');
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <HelpCircle size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Customer Support Center</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Get fast assistance from our dedicated store support team
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {!user ? (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: 'var(--text-muted)' }}>
              <AlertCircle size={38} color="var(--accent-warning)" style={{ margin: '0 auto 10px' }} />
              <div style={{ fontWeight: '600', color: '#fff', fontSize: '1rem' }}>Authentication Required</div>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                Please sign in to view your inquiries and submit new support tickets.
              </p>
            </div>
          ) : (
            <div>
              {/* Navigation Pill */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px' }}>
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`btn btn-sm ${activeTab === 'tickets' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ gap: '6px' }}
                >
                  <MessageSquare size={14} />
                  <span>My Inquiries ({tickets.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('new')}
                  className={`btn btn-sm ${activeTab === 'new' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ gap: '6px' }}
                >
                  <Plus size={14} />
                  <span>Open New Ticket</span>
                </button>
              </div>

              {/* TAB 1: Tickets List */}
              {activeTab === 'tickets' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
                  {tickets.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                      <div>No support tickets submitted yet.</div>
                      <button
                        onClick={() => setActiveTab('new')}
                        className="btn btn-primary btn-sm"
                        style={{ marginTop: '10px' }}
                      >
                        Ask a Question
                      </button>
                    </div>
                  ) : (
                    tickets.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => fetchTicketDetails(t.id)}
                        className="glass-card"
                        style={{
                          padding: '14px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          background: 'rgba(255, 255, 255, 0.02)'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>
                            {t.subject}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Ticket #{t.id} • Updated {new Date(t.updated_at).toLocaleString()} • {t.message_count || 1} messages
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            className={`badge ${
                              t.status === 'Resolved' ? 'badge-success' : t.status === 'In Progress' ? 'badge-primary' : 'badge-warning'
                            }`}
                          >
                            {t.status}
                          </span>
                          <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                            {t.priority} Priority
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: New Ticket Form (Controlled Form) */}
              {activeTab === 'new' && (
                <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Subject / Inquiry Title *</label>
                    <input
                      type="text"
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="e.g. Question about order tracking or product spec"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Priority Level</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value)}
                      className="form-select"
                    >
                      <option value="Low">Low - General Question</option>
                      <option value="Medium">Medium - Standard Request</option>
                      <option value="High">High - Urgent Order Issue</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Describe Your Issue / Inquiry *</label>
                    <textarea
                      rows={4}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Provide all relevant details so our support team can assist you quickly..."
                      className="form-textarea"
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('tickets')}
                      className="btn btn-secondary btn-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '6px' }}
                    >
                      <Send size={14} />
                      <span>{submitting ? 'Submitting...' : 'Submit Support Ticket'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: Ticket Thread Chat */}
              {activeTab === 'chat' && selectedTicket && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                    <div>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '1rem' }}>{selectedTicket.subject}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ticket #{selectedTicket.id} • {selectedTicket.status}</div>
                    </div>
                    <button
                      onClick={() => setActiveTab('tickets')}
                      className="btn btn-secondary btn-sm"
                    >
                      Back to Inquiries
                    </button>
                  </div>

                  {/* Messages Feed */}
                  <div
                    style={{
                      height: '240px',
                      overflowY: 'auto',
                      padding: '12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(0, 0, 0, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    {selectedTicket.messages?.map((msg) => {
                      const isAdminMsg = msg.is_admin;
                      return (
                        <div
                          key={msg.id}
                          style={{
                            alignSelf: isAdminMsg ? 'flex-start' : 'flex-end',
                            maxWidth: '80%',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            background: isAdminMsg ? 'rgba(99, 102, 241, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                            border: `1px solid ${isAdminMsg ? 'rgba(99, 102, 241, 0.4)' : 'rgba(16, 185, 129, 0.4)'}`
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: isAdminMsg ? '#a5b4fc' : '#6ee7b7', fontWeight: '700', marginBottom: '2px' }}>
                            {isAdminMsg && <Shield size={12} />}
                            <span>{msg.sender_name}</span>
                            <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>• {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div style={{ color: '#fff', fontSize: '0.85rem', lineHeight: '1.4' }}>
                            {msg.message}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chat Input */}
                  <form onSubmit={handleSendReply} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your message reply..."
                      className="form-input"
                    />
                    <button
                      type="submit"
                      disabled={sendingReply || !replyText.trim()}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '6px', padding: '8px 16px' }}
                    >
                      <Send size={14} />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerSupportModal;
