import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import { Link, useSearchParams } from 'react-router-dom';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get('filter') || 'all'; // 'all' or 'my'

  // Additional Search States
  const [searchName, setSearchName] = useState(searchParams.get('name') || '');
  const [searchOrg, setSearchOrg] = useState(searchParams.get('organizedBy') || '');
  const [searchDate, setSearchDate] = useState(searchParams.get('date') || '');
  const [searchStatus, setSearchStatus] = useState(searchParams.get('status') || '');

  const [allNames, setAllNames] = useState([]);
  const [allOrgs, setAllOrgs] = useState([]);
  const [myRegisteredIds, setMyRegisteredIds] = useState([]);

  // Apply filters via query params so they persist and are shareable
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (searchName) params.set('name', searchName); else params.delete('name');
    if (searchOrg) params.set('organizedBy', searchOrg); else params.delete('organizedBy');
    if (searchDate) params.set('date', searchDate); else params.delete('date');
    if (searchStatus) params.set('status', searchStatus); else params.delete('status');
    setSearchParams(params);
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint = '';
      const params = new URLSearchParams();

      if (user.role === 'Student') {
        if (filter === 'my') {
          // View User Registrations
          endpoint = '/myEvent';
        } else {
          // View Global Events
          endpoint = '/eventList/student';
          if (searchParams.get('name')) params.append('name', searchParams.get('name'));
          if (searchParams.get('organizedBy')) params.append('organizedBy', searchParams.get('organizedBy'));
          if (searchParams.get('date')) params.append('date', searchParams.get('date'));
        }
      } else {
        if (filter === 'registered') {
          endpoint = '/myEvent';
        } else {
          // View for Admin, Teacher, Club
          endpoint = '/eventList/admin/teacher/club';
          if (filter === 'my') {
            // Only events organized by the current user
            params.append('myEvents', 'true');
          }
          if (searchParams.get('status')) {
            params.append('status', searchParams.get('status'));
          }
        }
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      endpoint += queryString;

      const [eventsRes, myRes] = await Promise.all([
        apiClient.get(endpoint),
        apiClient.get('/myEvent').catch(() => ({ data: { data: { event: [] } } })) // Safe fetch registrations
      ]);

      const fetchedData = eventsRes.data.data;
      let eventsArray = [];
      if (Array.isArray(fetchedData)) {
        eventsArray = fetchedData;
      } else if (fetchedData && Array.isArray(fetchedData.event)) {
        // If it's the registrations array, we need to extract the inline events
        if ((filter === 'my' && user.role === 'Student') || (filter === 'registered' && user.role !== 'Student')) {
          eventsArray = fetchedData.event.map(registration => registration.event).filter(Boolean);
        } else {
          eventsArray = fetchedData.event;
        }
      }

      const myData = myRes.data.data;
      let myRegs = [];
      if (myData && Array.isArray(myData.event)) {
        myRegs = myData.event.map(reg => reg.event?._id).filter(id => id);
      }
      setMyRegisteredIds(myRegs);

      // Populate Student Dropdown Filters on initial/unfiltered fetch
      if (user.role === 'Student' && filter !== 'my' && !searchParams.get('name') && !searchParams.get('organizedBy') && !searchParams.get('date')) {
        // Filter out registered events before getting unique names and orgs
        const unregisteredEvents = eventsArray.filter(e => !myRegs.includes(e._id));
        const uniqueNames = [...new Set(unregisteredEvents.map(e => e.name))].filter(Boolean);
        const uniqueOrgs = [...new Set(unregisteredEvents.map(e => e.organizedBy))].filter(Boolean);
        if (allNames.length === 0) setAllNames(uniqueNames);
        if (allOrgs.length === 0) setAllOrgs(uniqueOrgs);
      }

      // Removed client-side filter from here so it can be applied after fetching/during render
      setEvents(eventsArray);
    } catch (err) {
      if (err.response?.status === 404 && err.response?.data?.message.includes('No registration found')) {
        setEvents([]);
      } else if (err.response?.status === 404 && err.response?.data?.message.includes('Events not found')) {
        setEvents([]);
      } else {
        setError('Failed to load events');
        setEvents([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchEvents();
  }, [searchParams, user]); // Refetch when URL query params or user changes

  // Apply Client-Side Filter on the fetched events
  const displayedEvents = React.useMemo(() => {
    let filtered = [...events];
    const statusFilter = searchParams.get('status');
    if (statusFilter && user?.role !== 'Student') {
      filtered = filtered.filter(e => e.status === statusFilter);
    }
    
    // Hide registered events from Student's Global Directory
    if (user?.role === 'Student' && filter !== 'my') {
      filtered = filtered.filter(e => !myRegisteredIds.includes(e._id));
    }

    return filtered;
  }, [events, searchParams, user, filter, myRegisteredIds]);

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '2.5rem', background: 'var(--gradient-main)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', width: '100%' }}>
          {filter === 'registered' ? 'My Registrations' : filter === 'my' ? (user?.role === 'Student' ? 'My Registrations' : 'My Hosted Events') : 'Events Directory'}
        </h1>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
          {/* Main View Filter */}
          <select 
            value={filter} 
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              params.set('filter', e.target.value);
              setSearchParams(params);
            }} 
            style={{ width: 'auto', padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.3)' }}
          >
            <option value="all">Global Directory</option>
            <option value="my">{user?.role === 'Student' ? 'My Registrations' : 'My Hosted Events'}</option>
          </select>

          {/* Student Specific Filters */}
          {user?.role === 'Student' && filter !== 'my' && (
            <>
              <select 
                value={searchName} 
                onChange={(e) => {
                  setSearchName(e.target.value);
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value) params.set('name', e.target.value); else params.delete('name');
                  setSearchParams(params);
                }} 
                style={{ width: 'auto', padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.3)' }}
              >
                <option value="">All Events</option>
                {allNames.map((n, i) => <option key={i} value={n}>{n}</option>)}
              </select>

              <select 
                value={searchOrg} 
                onChange={(e) => {
                  setSearchOrg(e.target.value);
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value) params.set('organizedBy', e.target.value); else params.delete('organizedBy');
                  setSearchParams(params);
                }} 
                style={{ width: 'auto', padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.3)' }}
              >
                <option value="">All Organizers</option>
                {allOrgs.map((o, i) => <option key={i} value={o}>{o}</option>)}
              </select>

              <input 
                type="date" 
                value={searchDate} 
                onChange={(e) => {
                  setSearchDate(e.target.value);
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value) params.set('date', e.target.value); else params.delete('date');
                  setSearchParams(params);
                }} 
                style={{ width: 'auto', padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.3)', colorAdjust: 'exact' }} 
              />
            </>
          )}

          {/* Admin/Teacher/Club Filters */}
          {user?.role !== 'Student' && (
            <>
              <select 
                value={searchStatus} 
                onChange={(e) => {
                  setSearchStatus(e.target.value);
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value) params.set('status', e.target.value); else params.delete('status');
                  setSearchParams(params);
                }} 
                style={{ width: 'auto', padding: '0.6rem 1rem', background: 'rgba(0,0,0,0.3)' }}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
              </select>
              <Link to="/events/create" className="btn btn-primary" style={{ marginLeft: 'auto', padding: '0.6rem 1.5rem' }}>+ Create Event</Link>
            </>
          )}
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner"></div>
        </div>
      ) : displayedEvents.length === 0 ? (
        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <h3>No events found.</h3>
          <p>Try adjusting your search filters or check back later.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))' }}>
          {displayedEvents.map((item) => {
            return <EventCard key={item._id} event={item} onUpdate={fetchEvents} isRegistered={myRegisteredIds.includes(item._id)} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Events;
