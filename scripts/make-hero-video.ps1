# 生成首页背景循环视频 public/videos/hero-loop.mp4
# 源视频为 4K/60fps/32.7s/211MB，此处压缩为 1080p/30fps/约20s 无缝循环（首尾交叉淡化），静音，约 3.3MB。
# 依赖：pip install imageio-ffmpeg（自带 ffmpeg 可执行文件）
$ErrorActionPreference = 'Stop'
$ff  = 'W:\Anaconda\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe'
$src = 'G:\Steam\steamapps\workshop\content\431960\3568265346\Desktop 2025.09.14 - 21.11.25.22.mp4'
$dst = Join-Path $PSScriptRoot '..\public\videos\hero-loop.mp4'
New-Item -ItemType Directory -Force -Path (Split-Path $dst) | Out-Null
& $ff -hide_banner -loglevel error -stats -i $src -filter_complex "[0:v]trim=start=4:end=24,setpts=PTS-STARTPTS,scale=1920:1080:flags=lanczos,fps=30[a];[0:v]trim=start=0:end=4,setpts=PTS-STARTPTS,scale=1920:1080:flags=lanczos,fps=30[b];[a][b]xfade=transition=fade:duration=3.5:offset=16.5,format=yuv420p[v]" -map "[v]" -an -c:v libx264 -preset medium -crf 30 -movflags +faststart -y $dst
Get-Item $dst | Select-Object FullName, Length