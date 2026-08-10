import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import {
  MessageSquare,
  Search,
  RefreshCw,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Shield,
  X
} from 'lucide-react';

export const CrmSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Active Ticket Conversation
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

  const { success, error: toastError } = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await api.support.getAllTickets({
        status: statusFilter,
        search: searchQuery
      });
      setTickets(res.tickets || []);
    } catch (err) {
      console.error('Failed to load CRM support tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetails = async (id) => {
    try {
      const res = await api.support.getTicketDetails(id);
      setSelectedTicket(res.ticket);
    } catch (err) {
      toastError(err.message || 'Failed to fetch ticket conversation.');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSendAdminReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    setSendingReply(true);
    try {
      await api.support.addMessage(selectedTicket.id, replyText.trim());
      setReplyText('');
      await fetchTicketDetails(selectedTicket.id);
      await fetchTickets();
      success('Admin response delivered to customer.');
    } catch (err) {
      toastError(err.message || 'Failed to send response.');
    } finally {
      setSendingReply(false);
    }
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedTicket) return;
    try {
      await api.support.updateStatus(selectedTicket.id, status);
      success(`Ticket status marked as '${status}'.`);
      setSelectedTicket((prev) => ({ ...prev, status }));
      await fetchTickets();
    } catch (err) {
      toastError(err.message || 'Failed to update ticket status.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
            CRM Support Desk & Customer Messaging
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Respond to inquiries, resolve issues, and track customer satisfaction
          </p>
        </div>

        <button onClick={fetchTickets} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Desk</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by subject, customer name or email..."
            className="form-input"
            style={{ paddingLeft: '38px', height: '40px' }}
          />
          <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 'var(--radius-full)', padding: '6px 12px', fontSize: '0.75rem' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split View: Ticket List & Interactive Response Thread */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.5fr', gap: '20px' }}>
        {/* Ticket List (Showcases List .map()) */}
        <div className="glass-panel" style={{ padding: '16px', maxHeight: '560px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
            Customer Tickets ({tickets.length})
          </div>

          {tickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
              No support tickets found.
            </div>
          ) : (
            tickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => fetchTicketDetails(t.id)}
                  className="glass-card"
                  style={{
                    padding: '14px',
                    cursor: 'pointer',
                    borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>{t.subject}</span>
                    <span
                      className={`badge ${
                        t.status === 'Resolved'
                          ? 'badge-success'
                          : t.status === 'In Progress'
                          ? 'badge-primary'
                          : t.status === 'Closed'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}
                      style={{ fontSize: '0.7rem' }}
                    >
                      {t.status}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    From: <strong style={{ color: '#fff' }}>{t.user_name}</strong> ({t.user_email})
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{new Date(t.updated_at).toLocaleString()}</span>
                    <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{t.priority} Priority</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Conversation Thread & Admin Response Panel */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '560px' }}>
          {!selectedTicket ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '10px' }}>
              <MessageSquare size={44} color="var(--border-glow)" />
              <div style={{ fontWeight: '600', color: '#fff' }}>Select a ticket to open conversation</div>
              <p style={{ fontSize: '0.85rem' }}>View customer inquiries and deliver prompt merchant replies</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Thread Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '14px', marginBottom: '14px' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
                    {selectedTicket.subject}
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Customer: <strong style={{ color: '#fff' }}>{selectedTicket.user_name}</strong> ({selectedTicket.user_email})
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {selectedTicket.status !== 'Resolved' && (
                    <button
                      onClick={() => handleUpdateStatus('Resolved')}
                      className="btn btn-success btn-sm"
                      style={{ fontSize: '0.75rem', padding: '4px 10px', gap: '4px' }}
                    >
                      <CheckCircle size={13} />
                      <span>Mark Resolved</span>
                    </button>
                  )}
                  {selectedTicket.status !== 'Closed' && (
                    <button
                      onClick={() => handleUpdateStatus('Closed')}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                    >
                      Close Ticket
                    </button>
                  )}
                </div>
              </div>

              {/* Messages Container */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  paddingRight: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  marginBottom: '14px'
                }}
              >
                {selectedTicket.messages?.map((msg) => {
                  const isAdmin = msg.is_admin;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isAdmin ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        padding: '12px 16px',
                        borderRadius: '14px',
                        background: isAdmin ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${isAdmin ? 'rgba(99, 102, 241, 0.5)' : 'var(--border-subtle)'}`
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: isAdmin ? '#c4b5fd' : '#6ee7b7', fontWeight: '700', marginBottom: '4px' }}>
                        {isAdmin ? <Shield size={13} /> : <User size={13} />}
                        <span>{msg.sender_name} {isAdmin ? '(CRM Team)' : '(Customer)'}</span>
                        <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>
                          • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ color: '#fff', fontSize: '0.875rem', lineHeight: '1.5' }}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Admin Reply Form (Controlled Form) */}
              <form onSubmit={handleSendAdminReply} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an official CRM response..."
                  className="form-input"
                  style={{ height: '42px' }}
                />
                <button
                  type="submit"
                  disabled={sendingReply || !replyText.trim()}
                  className="btn btn-primary btn-sm"
                  style={{ gap: '6px', padding: '0 18px' }}
                >
                  <Send size={15} />
                  <span>Reply</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CrmSupport;
