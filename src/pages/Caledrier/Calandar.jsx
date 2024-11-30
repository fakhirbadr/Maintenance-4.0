import React, { useState, useEffect } from "react";
import { formatDate } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Location from "../../components/Location";
import { Stack } from "@mui/material";
import frLocale from "@fullcalendar/core/locales/fr";
import { useTheme } from "@mui/material/styles";
import "./index.css";

const API_URL = "http://localhost:3000/api/v1/calendar"; // Remplacez par l'URL de votre backend

const Calandar = () => {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [currentEvents, setCurrentEvents] = useState([]);

  const theme = useTheme();
  const textColor = theme.palette.mode === "dark" ? "#FFFFFF" : "#000000";

  // Récupérer les événements depuis le backend
  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      if (data.status === "success" && Array.isArray(data.data.calendar)) {
        // Ajouter _id dans extendedProps pour chaque événement
        const eventsWithIds = data.data.calendar.map((event) => ({
          ...event,
          extendedProps: { ...event, _id: event._id }, // Ajout de _id à extendedProps
        }));
        setCurrentEvents(eventsWithIds);
      } else {
        console.error(
          "Les données reçues ne contiennent pas un tableau d'événements:",
          data
        );
      }
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
    }
  };

  // Créer un événement
  const createEvent = async (newEvent) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });
      const createdEvent = await response.json();

      // Ajouter un identifiant unique si non disponible
      if (!createdEvent._id) {
        createdEvent._id = new Date().getTime().toString();
      }

      setCurrentEvents((prevEvents) => [...prevEvents, createdEvent]);
    } catch (error) {
      console.error("Erreur lors de la création d'un événement:", error);
    }
  };

  // Supprimer un événement
  const deleteEvent = async (eventId) => {
    if (!eventId) {
      console.error("Event ID is required to delete the event.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete event with ID ${eventId}`);
      }

      setCurrentEvents((prevEvents) =>
        prevEvents.filter((event) => event._id !== eventId)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression de l'événement:", error);
    }
  };

  // Mettre à jour un événement
  const updateCalendar = async (eventId, updatedEvent) => {
    try {
      const response = await fetch(`${API_URL}/${eventId}`, {
        method: "PATCH", // Utilisation de PATCH pour la mise à jour partielle
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      });

      const data = await response.json();

      if (data.status === "success") {
        setCurrentEvents((prevEvents) =>
          prevEvents.map((event) =>
            event._id === eventId ? { ...event, ...updatedEvent } : event
          )
        );
      } else {
        console.error("Erreur lors de la mise à jour de l'événement:", data);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'événement:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible);
  }

  // Cette fonction gère le déplacement d'un événement
  function handleEventDrop(dropInfo) {
    const eventId = dropInfo.event.extendedProps._id || dropInfo.event.id;
    const newStart = dropInfo.event.startStr;
    const newEnd = dropInfo.event.endStr;

    if (eventId) {
      // Créer un objet avec les nouvelles données de l'événement
      const updatedEvent = {
        ...dropInfo.event.extendedProps,
        start: newStart,
        end: newEnd,
      };

      // Mettre à jour l'événement dans le backend
      updateCalendar(eventId, updatedEvent);

      // Mettre à jour l'état local avec les nouvelles dates
      setCurrentEvents((prevEvents) =>
        prevEvents.map((event) =>
          event._id === eventId
            ? { ...event, start: newStart, end: newEnd }
            : event
        )
      );
    }
  }

  function handleDateSelect(selectInfo) {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection

    if (title) {
      const newEvent = {
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      };
      createEvent(newEvent);
    }
  }

  function handleEventClick(clickInfo) {
    console.log(clickInfo.event); // Log de l'événement pour vérifier ses propriétés
    const eventId = clickInfo.event.extendedProps._id || clickInfo.event.id;
    if (eventId) {
      if (
        confirm(
          `Are you sure you want to delete the event '${clickInfo.event.title}'`
        )
      ) {
        deleteEvent(eventId);
        clickInfo.event.remove();
      }
    } else {
      console.error("Event ID is not available");
    }
  }

  function renderEventContent(eventInfo) {
    return (
      <>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </>
    );
  }

  function SidebarEvent({ event }) {
    return (
      <li key={event._id}>
        <b>
          {formatDate(event.start, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </b>
        <i>{event.title}</i>
      </li>
    );
  }

  return (
    <div>
      <div>
        <Location />
      </div>
      <Stack direction={"row"}>
        <div className="demo-app-sidebar" style={{ color: textColor }}>
          <div className="demo-app-sidebar-section">
            <label>
              <input
                type="checkbox"
                checked={weekendsVisible}
                onChange={handleWeekendsToggle}
              ></input>
              toggle weekends
            </label>
          </div>
          <div className="demo-app-sidebar-section">
            <h2>All Events ({currentEvents.length})</h2>
            <ul>
              {/* Vérifiez si currentEvents est un tableau avant d'utiliser .map */}
              {Array.isArray(currentEvents) &&
                currentEvents.map((event) => (
                  <SidebarEvent key={event._id || event.id} event={event} />
                ))}
            </ul>
          </div>
        </div>
        <div className="demo-app-main">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            locale={frLocale}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            initialView="dayGridMonth"
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={weekendsVisible}
            events={currentEvents} // Charger les événements depuis l'API
            select={handleDateSelect}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            eventDrop={handleEventDrop}
          />
        </div>
      </Stack>
    </div>
  );
};

export default Calandar;
