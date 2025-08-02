import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/24/outline";

// Mock data for candidates
const candidates = [
  {
    id: 1,
    name: "Roger Federrer",
    preferredSlots: [
      "2025-08-05T14:00:00",
      "2025-08-05T14:30:00",
      "2025-08-05T15:00:00",
      "2025-08-05T15:30:00",
      "2025-08-05T16:00:00",
      "2025-08-05T16:30:00",
    ],
  },
  {
    id: 2,
    name: "Lionel Messi",
    preferredSlots: [
      "2025-08-06T14:00:00",
      "2025-08-06T14:30:00",
      "2025-08-06T15:00:00",
      "2025-08-06T15:30:00",
      "2025-08-06T16:00:00",
      "2025-08-06T16:30:00",
    ],
  },
  {
    id: 3,
    name: "Samuel Etoo",
    preferredSlots: [
      "2025-08-07T11:30:00",
      "2025-08-07T12:00:00",
      "2025-08-07T12:30:00",
      "2025-08-07T13:00:00",
      "2025-08-07T13:30:00",
      "2025-08-07T14:00:00",
      "2025-08-07T14:30:00",
      "2025-08-07T15:00:00",
      "2025-08-07T15:30:00",
      "2025-08-07T16:00:00",
      "2025-08-07T16:30:00",
    ],
  },
];

// Mock data for engineers
const engineerAvailability = [
  {
    id: 1,
    name: "Michael Jordan",
    slots: [
      "2025-08-05T14:30:00",
      "2025-08-05T16:00:00",
      "2025-08-06T15:00:00",
      "2025-08-06T16:00:00",
      "2025-08-07T14:00:00",
      "2025-08-07T16:30:00",
    ],
    schedule: [],
  },
  {
    id: 2,
    name: "Serena Williams",
    slots: [
      "2025-08-07T12:30:00",
      "2025-08-06T14:30:00",
      "2025-08-06T15:00:00",
      "2025-08-07T13:30:00",
      "2025-08-07T14:00:00",
      "2025-08-05T16:30:00",
      "2025-08-07T15:00:00",
    ],
    schedule: [],
  },
  {
    id: 3,
    name: "Halle Berry",
    slots: [
      "2025-08-05T16:30:00",
      "2025-08-06T14:30:00",
      "2025-08-06T16:00:00",
      "2025-08-07T15:30:00",
      "2025-08-07T16:00:00",
      "2025-08-07T16:30:00",
    ],
    schedule: [],
  },
];

export const Calendar = () => {
  const [week, setWeek] = useState(0);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [selectedEngineer, setSelectedEngineer] = useState<any>(null);
  const [availableEngineer, setAvailableEngineer] = useState<any>(null);
  const [availableEngineers, setAvailableEngineers] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [schedule, setSchedule] = useState<any>([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    generateTimeSlots();
    setAvailableEngineers(engineerAvailability);
  }, []);

  useEffect(() => {
    var curr = new Date();
    let currWeek: string[] = [];

    for (let i = 1; i <= 5; i++) {
      let day: number;
      if (i == 1) {
        day = curr.getDate() + week * 7 - curr.getDay() + i;
      } else {
        day = curr.getDate() - curr.getDay() + i;
      }

      var fullDay = new Date(curr.setDate(day)).toUTCString();
      currWeek.push(fullDay);
    }

    setWeekDays(currWeek);
  }, [week]);

  const generateTimeSlots = () => {
    const slots = [];
    let startHour = 9;
    let endHour = 18;

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    setTimeSlots(slots);
  };

  const convertTime = (dayString: string, timeString: string) => {
    const [hours, minutes] = timeString.split(":");

    const now = new Date(dayString); // Get current date and time
    now.setHours(parseInt(hours, 10)); // Set the hours
    now.setMinutes(parseInt(minutes, 10)); // Set the minutes
    now.setSeconds(0); // Optional: Reset seconds to 0
    now.setMilliseconds(0);

    // convert to MDT
    const mdtOffset = -6 * 60 * 60 * 1000;
    const mdtTime = new Date(now.getTime() + mdtOffset);

    const isoString = mdtTime.toISOString();
    const formattedDate = isoString.split(".")[0];

    return formattedDate;
  };

  const handleSelectSlot = (slot: string) => {
    setOpen(true);
    setSelectedSlot(slot);
  };

  const handleConfirmSlot = () => {
    let theSchedule = schedule.find(
      (sch: any) => sch.candidate.id == selectedCandidate.id
    );

    if (theSchedule) {
      theSchedule.engineer = selectedEngineer;
      theSchedule.date = selectedSlot;
    } else {
      schedule.push({
        candidate: selectedCandidate,
        engineer: selectedEngineer,
        date: selectedSlot,
      });
    }

    setSchedule(schedule);
    setOpen(false);
  };

  const closeConfirm = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="">
        <div className="flex flex-row items-center justify-between">
          <div className="">
            <label htmlFor="candidate">Select Candidate:</label>
            <select
              id="candidate"
              onChange={(e) =>
                setSelectedCandidate(
                  candidates.find((c) => c.id === parseInt(e.target.value))
                )
              }
              value={selectedCandidate?.id || ""}
            >
              <option value="">-- Select a candidate --</option>
              {candidates.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.name}
                </option>
              ))}
            </select>
          </div>

          <div className="">
            <label htmlFor="engineer">Select Engineer:</label>
            <select
              id="engineer"
              onChange={(e) =>
                setAvailableEngineer(
                  availableEngineers.find(
                    (c) => c.id === parseInt(e.target.value)
                  )
                )
              }
              value={availableEngineer?.id || ""}
            >
              <option value="">-- Select an Engineer --</option>
              {availableEngineers.map((eng) => (
                <option key={eng.id} value={eng.id}>
                  {eng.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {selectedCandidate &&
          schedule
            .filter((sched: any) => sched.candidate.id == selectedCandidate.id)
            .map((sch: any, index: any) => (
              <div
                key={index}
                className="text-left mt-10 p-5 rounded-xl border-black border text-white bg-green-700"
              >
                <h3>Interview Scheduled!</h3>
                <p>
                  <strong>Candidate:</strong> {sch.candidate.name}
                </p>
                <p>
                  <strong>Engineer:</strong> {sch.engineer.name}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {new Date(sch.date).toLocaleDateString("en-us", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
        <section className="relative bg-stone-50 py-24">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 overflow-x-auto">
            <div className="flex flex-col md:flex-row max-md:gap-3 items-center justify-between mb-5">
              <div className="flex items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M17 4.50001L17 5.15001L17 4.50001ZM6.99999 4.50002L6.99999 3.85002L6.99999 4.50002ZM8.05078 14.65C8.40977 14.65 8.70078 14.359 8.70078 14C8.70078 13.641 8.40977 13.35 8.05078 13.35V14.65ZM8.00078 13.35C7.6418 13.35 7.35078 13.641 7.35078 14C7.35078 14.359 7.6418 14.65 8.00078 14.65V13.35ZM8.05078 17.65C8.40977 17.65 8.70078 17.359 8.70078 17C8.70078 16.641 8.40977 16.35 8.05078 16.35V17.65ZM8.00078 16.35C7.6418 16.35 7.35078 16.641 7.35078 17C7.35078 17.359 7.6418 17.65 8.00078 17.65V16.35ZM12.0508 14.65C12.4098 14.65 12.7008 14.359 12.7008 14C12.7008 13.641 12.4098 13.35 12.0508 13.35V14.65ZM12.0008 13.35C11.6418 13.35 11.3508 13.641 11.3508 14C11.3508 14.359 11.6418 14.65 12.0008 14.65V13.35ZM12.0508 17.65C12.4098 17.65 12.7008 17.359 12.7008 17C12.7008 16.641 12.4098 16.35 12.0508 16.35V17.65ZM12.0008 16.35C11.6418 16.35 11.3508 16.641 11.3508 17C11.3508 17.359 11.6418 17.65 12.0008 17.65V16.35ZM16.0508 14.65C16.4098 14.65 16.7008 14.359 16.7008 14C16.7008 13.641 16.4098 13.35 16.0508 13.35V14.65ZM16.0008 13.35C15.6418 13.35 15.3508 13.641 15.3508 14C15.3508 14.359 15.6418 14.65 16.0008 14.65V13.35ZM16.0508 17.65C16.4098 17.65 16.7008 17.359 16.7008 17C16.7008 16.641 16.4098 16.35 16.0508 16.35V17.65ZM16.0008 16.35C15.6418 16.35 15.3508 16.641 15.3508 17C15.3508 17.359 15.6418 17.65 16.0008 17.65V16.35ZM8.65 3C8.65 2.64101 8.35898 2.35 8 2.35C7.64102 2.35 7.35 2.64101 7.35 3H8.65ZM7.35 6C7.35 6.35899 7.64102 6.65 8 6.65C8.35898 6.65 8.65 6.35899 8.65 6H7.35ZM16.65 3C16.65 2.64101 16.359 2.35 16 2.35C15.641 2.35 15.35 2.64101 15.35 3H16.65ZM15.35 6C15.35 6.35899 15.641 6.65 16 6.65C16.359 6.65 16.65 6.35899 16.65 6H15.35ZM6.99999 5.15002L17 5.15001L17 3.85001L6.99999 3.85002L6.99999 5.15002ZM20.35 8.50001V17H21.65V8.50001H20.35ZM17 20.35H7V21.65H17V20.35ZM3.65 17V8.50002H2.35V17H3.65ZM7 20.35C6.03882 20.35 5.38332 20.3486 4.89207 20.2826C4.41952 20.2191 4.1974 20.1066 4.04541 19.9546L3.12617 20.8739C3.55996 21.3077 4.10214 21.4881 4.71885 21.571C5.31685 21.6514 6.07557 21.65 7 21.65V20.35ZM2.35 17C2.35 17.9245 2.34862 18.6832 2.42902 19.2812C2.51193 19.8979 2.69237 20.4401 3.12617 20.8739L4.04541 19.9546C3.89341 19.8026 3.78096 19.5805 3.71743 19.108C3.65138 18.6167 3.65 17.9612 3.65 17H2.35ZM20.35 17C20.35 17.9612 20.3486 18.6167 20.2826 19.108C20.219 19.5805 20.1066 19.8026 19.9546 19.9546L20.8738 20.8739C21.3076 20.4401 21.4881 19.8979 21.571 19.2812C21.6514 18.6832 21.65 17.9245 21.65 17H20.35ZM17 21.65C17.9244 21.65 18.6831 21.6514 19.2812 21.571C19.8979 21.4881 20.44 21.3077 20.8738 20.8739L19.9546 19.9546C19.8026 20.1066 19.5805 20.2191 19.1079 20.2826C18.6167 20.3486 17.9612 20.35 17 20.35V21.65ZM17 5.15001C17.9612 5.15 18.6167 5.15138 19.1079 5.21743C19.5805 5.28096 19.8026 5.39341 19.9546 5.54541L20.8738 4.62617C20.44 4.19238 19.8979 4.01194 19.2812 3.92902C18.6831 3.84862 17.9244 3.85001 17 3.85001L17 5.15001ZM21.65 8.50001C21.65 7.57557 21.6514 6.81686 21.571 6.21885C21.4881 5.60214 21.3076 5.05996 20.8738 4.62617L19.9546 5.54541C20.1066 5.6974 20.219 5.91952 20.2826 6.39207C20.3486 6.88332 20.35 7.53882 20.35 8.50001H21.65ZM6.99999 3.85002C6.07556 3.85002 5.31685 3.84865 4.71884 3.92905C4.10214 4.01196 3.55996 4.1924 3.12617 4.62619L4.04541 5.54543C4.1974 5.39344 4.41952 5.28099 4.89207 5.21745C5.38331 5.15141 6.03881 5.15002 6.99999 5.15002L6.99999 3.85002ZM3.65 8.50002C3.65 7.53884 3.65138 6.88334 3.71743 6.39209C3.78096 5.91954 3.89341 5.69743 4.04541 5.54543L3.12617 4.62619C2.69237 5.05999 2.51193 5.60217 2.42902 6.21887C2.34862 6.81688 2.35 7.57559 2.35 8.50002H3.65ZM3 10.65H21V9.35H3V10.65ZM8.05078 13.35H8.00078V14.65H8.05078V13.35ZM8.05078 16.35H8.00078V17.65H8.05078V16.35ZM12.0508 13.35H12.0008V14.65H12.0508V13.35ZM12.0508 16.35H12.0008V17.65H12.0508V16.35ZM16.0508 13.35H16.0008V14.65H16.0508V13.35ZM16.0508 16.35H16.0008V17.65H16.0508V16.35ZM7.35 3V6H8.65V3H7.35ZM15.35 3V6H16.65V3H15.35Z"
                    fill="#111827"
                  ></path>
                </svg>
                <h6 className="text-xl leading-8 font-semibold text-gray-900">
                  Today{" - "}
                  {new Date().toLocaleDateString("en-us", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </h6>
              </div>
              <div className="flex items-center gap-px rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setWeek(week - 1)}
                  disabled={week === 0}
                  className="rounded-lg py-2.5 px-5 text-sm font-medium text-gray-500 transition-all duration-300 hover:bg-white hover:text-indigo-600"
                >
                  {"<"}
                </button>
                <button className="rounded-lg py-2.5 px-5 text-sm font-medium text-indigo-600 bg-white transition-all duration-300 hover:bg-white hover:text-indigo-600">
                  Week
                </button>
                <button
                  onClick={() => setWeek(week + 1)}
                  className="rounded-lg py-2.5 px-5 text-sm font-medium text-gray-500 transition-all duration-300 hover:bg-white hover:text-indigo-600"
                >
                  {">"}
                </button>
              </div>
            </div>
            <div className=" relative">
              <div className="grid grid-cols-6 border-t border-gray-200 sticky top-0 left-0 w-full">
                <div className="p-3.5 flex items-center justify-center text-sm font-medium  text-gray-900"></div>
                {weekDays.map((day, i) => (
                  <div
                    key={i}
                    className="p-3.5 flex items-center justify-center text-sm font-medium  text-gray-900"
                  >
                    {new Date(day).toLocaleDateString("en-us", {
                      weekday: "short",
                    }) +
                      ", " +
                      new Date(day).toLocaleString("default", {
                        month: "short",
                      }) +
                      " " +
                      new Date(day).getDate()}
                  </div>
                ))}
              </div>

              {timeSlots.map((time, j) => (
                <div
                  key={j}
                  className="grid-cols-6 grid w-full overflow-x-auto"
                >
                  <div className="h-32 lg:h-28 p-0.5 md:p-3.5 border-t border-r border-gray-200 flex items-end transition-all hover:bg-stone-100">
                    <span className="text-xs font-semibold text-gray-400">
                      {time} -{" "}
                      {timeSlots.length == j + 1 ? "18:00" : timeSlots[j + 1]}
                    </span>
                  </div>
                  {weekDays.map((day, i) => (
                    <div
                      key={i}
                      onClick={() => handleSelectSlot(convertTime(day, time))}
                      className={`h-32 lg:h-28 p-0.5 md:p-3.5 border-t border-gray-200 transition-all ${
                        i == 4 ? "" : "border-r"
                      } ${
                        selectedCandidate &&
                        selectedCandidate.preferredSlots.find(
                          (slot: string) => slot == convertTime(day, time)
                        )
                          ? "bg-green-300 hover:bg-green-700"
                          : " hover:bg-stone-100"
                      }`}
                    >
                      {(
                        (availableEngineer &&
                          availableEngineers.filter(
                            (avail) => avail.id == availableEngineer.id
                          )) ||
                        availableEngineers
                      ).map(
                        (
                          eng: {
                            id: any;
                            slots: any[];
                            name: string;
                          },
                          k: React.Key
                        ) =>
                          eng.slots.find(
                            (slot: string) => slot == convertTime(day, time)
                          ) ? (
                            <div
                              key={k}
                              className={
                                "mb-1 rounded p-1 border-l-2 border-purple-600 bg-purple-50"
                              }
                            >
                              <p className="text-xs font-normal text-gray-900 mb-px">
                                {eng.name}
                              </p>
                              <p className="text-xs font-semibold text-purple-600">
                                {schedule.find(
                                  (sch: any) =>
                                    sch.engineer.id == eng.id &&
                                    sch.date == convertTime(day, time)
                                )
                                  ? "booked"
                                  : "available"}
                              </p>
                            </div>
                          ) : (
                            <div key={k}></div>
                          )
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Dialog open={open} onClose={setOpen} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                    <CalendarIcon
                      aria-hidden="true"
                      className="size-6 text-green-600"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-base font-semibold text-gray-900"
                    >
                      Confirm Interview
                    </DialogTitle>
                    <div className="mt-2">
                      <p>
                        {!selectedCandidate &&
                          "please select a candidate to schedule an interview"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Your selected slot: {selectedSlot}
                      </p>
                      <div>
                        <p>Select an Engineer</p>
                        {(
                          (availableEngineer &&
                            availableEngineers.filter(
                              (avail) => avail.id == availableEngineer.id
                            )) ||
                          availableEngineers
                        ).map(
                          (eng: { slots: any[]; name: string }, k: React.Key) =>
                            eng.slots.find(
                              (slot: string) => slot == selectedSlot
                            ) ? (
                              <button
                                key={k}
                                type="button"
                                data-autofocus
                                onClick={() => setSelectedEngineer(eng)}
                                className={`${
                                  selectedEngineer == eng
                                    ? "bg-red-950 hover:bg-red-700"
                                    : "bg-gray-800 hover:bg-gray-600"
                                } mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-xs ring-1 ring-gray-300 ring-inset sm:mt-0 sm:w-auto`}
                              >
                                {eng.name}
                              </button>
                            ) : (
                              <div key={k}></div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                {selectedCandidate && selectedEngineer && (
                  <button
                    type="button"
                    onClick={() => handleConfirmSlot()}
                    className="inline-flex w-full justify-center rounded-md bg-green-700 hover:bg-green-500 px-3 py-2 text-sm font-semibold text-white shadow-xs  sm:ml-3 sm:w-auto"
                  >
                    Confirm
                  </button>
                )}

                <button
                  type="button"
                  data-autofocus
                  onClick={() => closeConfirm()}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
};
