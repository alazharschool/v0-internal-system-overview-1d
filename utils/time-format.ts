// Time formatting utilities for Al-Azhar School Management System

export function formatEgyptTime(time: string): string {
  try {
    if (!time || typeof time !== "string") return "Invalid time"

    const [hours, minutes] = time.split(":").map(Number)

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return "Invalid time"
    }

    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours

    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period} (Egypt)`
  } catch (error) {
    console.error("Error formatting Egypt time:", error)
    return "Invalid time"
  }
}

export function formatStudentTime(time: string, timezone: string): string {
  try {
    if (!time || typeof time !== "string") return "Invalid time"

    const [hours, minutes] = time.split(":").map(Number)

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return "Invalid time"
    }

    let adjustedHours = hours
    let timezoneDisplay = "Local"

    if (timezone && typeof timezone === "string") {
      const lowerTimezone = timezone.toLowerCase()

      if (lowerTimezone.includes("saudi") || lowerTimezone.includes("riyadh") || lowerTimezone.includes("utc+3")) {
        adjustedHours = hours + 1
        timezoneDisplay = "KSA"
      } else if (lowerTimezone.includes("uae") || lowerTimezone.includes("dubai") || lowerTimezone.includes("utc+4")) {
        adjustedHours = hours + 2
        timezoneDisplay = "UAE"
      } else if (
        lowerTimezone.includes("egypt") ||
        lowerTimezone.includes("cairo") ||
        lowerTimezone.includes("utc+2")
      ) {
        timezoneDisplay = "Egypt"
      }
    }

    if (adjustedHours >= 24) adjustedHours -= 24
    if (adjustedHours < 0) adjustedHours += 24

    const period = adjustedHours >= 12 ? "PM" : "AM"
    const displayHours = adjustedHours === 0 ? 12 : adjustedHours > 12 ? adjustedHours - 12 : adjustedHours

    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period} (${timezoneDisplay})`
  } catch (error) {
    console.error("Error formatting student time:", error)
    return "Invalid time"
  }
}

export function formatTime(time: string): string {
  try {
    if (!time || typeof time !== "string") return "Invalid time"

    const [hours, minutes] = time.split(":").map(Number)

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return "Invalid time"
    }

    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours

    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`
  } catch (error) {
    console.error("Error formatting time:", error)
    return "Invalid time"
  }
}

export function getDayName(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      return "Invalid date"
    }

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dateObj.getDay()]
  } catch (error) {
    console.error("Error getting day name:", error)
    return "Invalid date"
  }
}

export function formatDateWithDay(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      return "Invalid date"
    }

    const dayName = getDayName(dateObj)
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

    return `${dayName}, ${formattedDate}`
  } catch (error) {
    console.error("Error formatting date with day:", error)
    return "Invalid date"
  }
}

export function formatDateShort(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date

    if (isNaN(dateObj.getTime())) {
      return "Invalid date"
    }

    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  } catch (error) {
    console.error("Error formatting short date:", error)
    return "Invalid date"
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString)

    if (isNaN(date.getTime())) {
      return "Invalid date"
    }

    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
      return "Just now"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? "day" : "days"} ago`
    } else {
      return formatDateShort(date)
    }
  } catch (error) {
    console.error("Error formatting relative time:", error)
    return "Invalid date"
  }
}

export function generateTimeSlots(startHour: number, endHour: number, intervalMinutes: number): string[] {
  const slots: string[] = []

  try {
    if (
      typeof startHour !== "number" ||
      typeof endHour !== "number" ||
      typeof intervalMinutes !== "number" ||
      startHour < 0 ||
      startHour > 23 ||
      endHour < 0 ||
      endHour > 23 ||
      intervalMinutes <= 0
    ) {
      return slots
    }

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
        slots.push(timeString)
      }
    }

    slots.push(`${endHour.toString().padStart(2, "0")}:00`)
  } catch (error) {
    console.error("Error generating time slots:", error)
  }

  return slots
}

export function generateTimeSlots12Hour(startHour: number, endHour: number, intervalMinutes: number): string[] {
  const slots: string[] = []

  try {
    if (
      typeof startHour !== "number" ||
      typeof endHour !== "number" ||
      typeof intervalMinutes !== "number" ||
      startHour < 0 ||
      startHour > 23 ||
      endHour < 0 ||
      endHour > 23 ||
      intervalMinutes <= 0
    ) {
      return slots
    }

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        const period = hour >= 12 ? "PM" : "AM"
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
        const timeString = `${displayHour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")} ${period}`
        slots.push(timeString)
      }
    }

    const period = endHour >= 12 ? "PM" : "AM"
    const displayHour = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour
    slots.push(`${displayHour.toString().padStart(2, "0")}:00 ${period}`)
  } catch (error) {
    console.error("Error generating 12-hour time slots:", error)
  }

  return slots
}

export function formatTime12Hour(time: string): string {
  try {
    if (!time || typeof time !== "string") return "Invalid time"

    const [hours, minutes] = time.split(":").map(Number)

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return "Invalid time"
    }

    const period = hours >= 12 ? "PM" : "AM"
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours

    return `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`
  } catch (error) {
    console.error("Error formatting time to 12 hour:", error)
    return "Invalid time"
  }
}

export function getCurrentDateTime(): { date: string; time: string } {
  const now = new Date()
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayName = days[now.getDay()]
  const monthName = months[now.getMonth()]
  const date = now.getDate()
  const year = now.getFullYear()

  const hours = now.getHours()
  const minutes = now.getMinutes()
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours

  const dateString = `${dayName}, ${date} ${monthName} ${year}`
  const timeString = `${displayHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${period}`

  return { date: dateString, time: timeString }
}

export function addMinutesToTime(time: string, minutes: number): string {
  try {
    if (!time || typeof time !== "string" || typeof minutes !== "number") {
      return "Invalid input"
    }

    const [hours, mins] = time.split(":").map(Number)

    if (isNaN(hours) || isNaN(mins) || hours < 0 || hours > 23 || mins < 0 || mins > 59) {
      return "Invalid time"
    }

    let totalMinutes = hours * 60 + mins + minutes
    totalMinutes = totalMinutes % (24 * 60)

    if (totalMinutes < 0) {
      totalMinutes += 24 * 60
    }

    const newHours = Math.floor(totalMinutes / 60)
    const newMinutes = totalMinutes % 60

    return `${newHours.toString().padStart(2, "0")}:${newMinutes.toString().padStart(2, "0")}`
  } catch (error) {
    console.error("Error adding minutes to time:", error)
    return "Invalid time"
  }
}
