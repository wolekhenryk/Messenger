using System;
using System.IO;

namespace Messenger.API.Services.Helpers;

public static class DockerDetector
{
    private static readonly Lazy<bool> _isRunningInDocker = new(() =>
    {
        try
        {
            if (Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER")?.ToLowerInvariant() == "true")
                return true;

            if (File.Exists("/.dockerenv"))
                return true;

            if (OperatingSystem.IsLinux() && File.Exists("/proc/1/cgroup"))
            {
                var lines = File.ReadAllLines("/proc/1/cgroup");
                if (lines.Any(line => line.Contains("docker") || line.Contains("kubepods") || line.Contains("containerd")))
                {
                    return true;
                }
            }
        }
        catch
        {
            //
        }

        return false;
    });

    public static bool IsRunningInDocker => _isRunningInDocker.Value;
}