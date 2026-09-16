# 从 Obsidian 库同步「学习笔记」到网站
# 用法（在项目根目录）：powershell -ExecutionPolicy Bypass -File scripts\import-notes.ps1
# 做了三件事：
#   1. 把指定笔记复制到 src/content/notes/（统一改成 LF、UTF-8 无 BOM）
#   2. 把 Obsidian 图片嵌入 ![[xxx.png|447]] 改写成标准 Markdown ![](/notes/xxx.png)
#   3. 把用到的截图复制到 public/notes/
param(
  [string]$Vault = 'W:\Obsidian\数据分析学习\我不是乔治_2026.7',
  [string]$NoteDir = '数据分析'
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$noteOut = Join-Path $root 'src\content\notes'
$imgOut = Join-Path $root 'public\notes'
New-Item -ItemType Directory -Force -Path $noteOut | Out-Null
New-Item -ItemType Directory -Force -Path $imgOut | Out-Null

# Obsidian 文件名 -> 项目内文件名（避免中文/空格路径在构建与部署时出问题）
$map = [ordered]@{
  'Excel.md'       = 'excel.md'
  'SQL.md'         = 'sql.md'
  'SQL刷题-牛客.md' = 'sql-nowcoder.md'
}

$enc = New-Object System.Text.UTF8Encoding($false)
$copiedImages = 0

foreach ($srcName in $map.Keys) {
  $srcPath = Join-Path (Join-Path $Vault $NoteDir) $srcName
  if (-not (Test-Path -LiteralPath $srcPath)) { throw "找不到笔记文件：$srcPath" }

  $text = [System.IO.File]::ReadAllText($srcPath)
  $text = $text -replace "`r`n", "`n"

  # 1) 图片嵌入 ![[name|size]] -> ![](/notes/name-with-dashes.png)
  $embeds = [regex]::Matches($text, '!\[\[([^\]\|]+)(?:\|[^\]]*)?\]\]')
  foreach ($m in $embeds) {
    $name = $m.Groups[1].Value.Trim()
    $slug = $name -replace '\s+', '-'
    $from = Join-Path $Vault $name
    if (Test-Path -LiteralPath $from) {
      Copy-Item -LiteralPath $from -Destination (Join-Path $imgOut $slug) -Force
      $copiedImages++
      $text = $text.Replace($m.Value, "![](/notes/$slug)")
    } else {
      Write-Warning "图片不存在，已移除引用：$name"
      $text = $text.Replace($m.Value, '')
    }
  }

  # 2) 双链 [[笔记名]] / [[笔记名|别名]] -> 纯文本
  $text = [regex]::Replace($text, '(?<!!)\[\[([^\]\|]+)(?:\|([^\]]*))?\]\]', {
    param($mm) if ($mm.Groups[2].Success) { $mm.Groups[2].Value } else { $mm.Groups[1].Value }
  })

  $text = $text.TrimEnd("`n") + "`n"
  $destName = $map[$srcName]
  [System.IO.File]::WriteAllText((Join-Path $noteOut $destName), $text, $enc)
  Write-Host ("OK  {0,-18} -> src/content/notes/{1,-18} {2,7} chars" -f $srcName, $destName, $text.Length)
}

Write-Host "图片已复制 $copiedImages 张到 public/notes/"