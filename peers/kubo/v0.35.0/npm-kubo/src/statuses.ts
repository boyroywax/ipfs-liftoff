enum KuboStatus {
    NotInstalled = 'NotInstalled',
    Error = 'Error',
    Uninstalling = 'Uninstalling',
    Installing = 'Installing',
    Uninstalled = 'Uninstalled',
    Installed = 'Installed',
    InstallingError = 'InstallingError',
    UninstallingError = 'UninstallingError',
    AlreadyInstalled = 'AlreadyInstalled',
    AlreadyUninstalled = 'AlreadyUninstalled',
    AlreadyInstalling = 'AlreadyInstalling',
    AlreadyUninstalling = 'AlreadyUninstalling'
}

type KuboStatusType = keyof typeof KuboStatus;

export {
    KuboStatus,
    type KuboStatusType
}