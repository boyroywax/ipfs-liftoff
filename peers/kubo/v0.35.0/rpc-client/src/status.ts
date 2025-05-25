enum KuboStatuses {
    Initializing = 'Initializing',
    Configuring = 'Configuring',
    Starting = 'Starting',
    Online = 'Online',
    Offline = 'Offline',
    Stopping = 'Stopping',
    Error = 'Error'
}

type KuboStatus = keyof typeof KuboStatuses;

export {
    type KuboStatuses,
    KuboStatus
}