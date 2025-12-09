class RecorderEngine {
  constructor() {
    this.recording = false;
    this.actions = [];
    this.currentSocket = null;
  }

  startRecording(socket) {
    this.recording = true;
    this.actions = [];
    this.currentSocket = socket;
    console.log('Grabación iniciada');
  }

  stopRecording() {
    this.recording = false;
    const recordedActions = [...this.actions];
    this.actions = [];
    console.log('Grabación detenida. Acciones grabadas:', recordedActions.length);
    return recordedActions;
  }

  addAction(action) {
    if (this.recording) {
      const actionWithTimestamp = {
        ...action,
        timestamp: Date.now(),
        id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      this.actions.push(actionWithTimestamp);

      if (this.currentSocket) {
        this.currentSocket.emit('action-recorded', actionWithTimestamp);
      }
    }
  }

  isRecording() {
    return this.recording;
  }

  getActions() {
    return this.actions;
  }
}

module.exports = RecorderEngine;
