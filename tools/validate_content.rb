#!/usr/bin/env ruby
# Build-time check of data/content.json. Exits non-zero on problems.
require "json"
require "uri"

path = File.expand_path("../data/content.json", __dir__)
data = JSON.parse(File.read(path))
errors = []

check = lambda do |kind, item, fields|
  fields.each { |f| errors << "#{kind} #{item['name'] || item['label'] || '?'}: missing #{f}" if item[f].to_s.strip.empty? }
  url = item["url"].to_s
  unless url.empty?
    ok = begin
      u = URI.parse(url); %w[https mailto].include?(u.scheme)
    rescue URI::InvalidURIError
      false
    end
    errors << "#{kind} #{item['name'] || item['label']}: url must be https (or mailto): #{url}" unless ok
  end
end

data.fetch("links", []).each        { |l| check.("link", l, %w[label url]) }
data.fetch("projects", []).each     { |p| check.("project", p, %w[name desc url]) }
data.fetch("contributions", []).each { |c| check.("contribution", c, %w[name desc url]) }
ids = data.fetch("langs", []).map { |l| l["id"] }
%w[html rust python java c ruby].each { |id| errors << "langs: missing #{id}" unless ids.include?(id) }
data["projects"].to_a.each do |p|
  (p["langs"] || []).each { |id| errors << "project #{p['name']}: unknown lang #{id}" unless ids.include?(id) }
end

if errors.empty?
  puts "content ok: #{data['projects'].size} projects, #{data['contributions'].size} contributions, #{ids.size} languages"
else
  warn errors
  exit 1
end
