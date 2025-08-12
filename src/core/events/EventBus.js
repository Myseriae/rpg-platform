// EventBus.js placeholder
/**
 * EventBus - a simple publish/subscribe system for decoupled communication.
 * Allows different parts of the app to communicate without direct references.
 */
class EventBus {
  constructor() {
    // Map to hold event names (keys) and arrays of subscriber callbacks (values)
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event by providing an event name and callback function.
   * The callback will be invoked whenever the event is emitted.
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  /**
   * Unsubscribe a callback from an event.
   * If no callback is provided, removes all callbacks for that event.
   */
  off(event, callback) {
    if (!this.listeners.has(event)) return;
    if (!callback) {
      // Remove all listeners for this event
      this.listeners.delete(event);
    } else {
      // Remove the specific callback from the listeners
      const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
      if (callbacks.length > 0) {
        this.listeners.set(event, callbacks);
      } else {
        this.listeners.delete(event);
      }
    }
  }

  /**
   * Emit an event, invoking all subscribed callbacks with the provided data.
   * The data can be any value or object (use object for multiple parameters).
   */
  emit(event, data = {}) {
    if (!this.listeners.has(event)) return;
    for (const callback of this.listeners.get(event)) {
      try {
        callback(data);
      } catch (err) {
        console.error(`EventBus error in "${event}" listener:`, err);
      }
    }
  }
}

// Create a single global EventBus instance and export it
const eventBus = new EventBus();
export default eventBus;

/* Example usage:
   eventBus.on('player:levelUp', data => console.log('Player leveled up to', data.newLevel));
   eventBus.emit('player:levelUp', { newLevel: 2 });
   // In this app, eventBus is used for tab switching events (see src/main.js).
*/
