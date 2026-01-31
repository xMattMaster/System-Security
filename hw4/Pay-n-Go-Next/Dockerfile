# Final production stage using a fixed Alpine Node image.
FROM node:latest
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED=1

# Create only the non-root 'nextjs' user (and its default group, also named 'nextjs')
RUN adduser --system --uid 1001 nextjs

# --- IMPORTANT ASSUMPTION ---
# This single-stage Dockerfile relies on the following directories
# being present in the local build context (pre-built application):
# ./.next/standalone, ./.next/static, and ./public

# Copy standalone output (server.js, node_modules, traced files) and set ownership
# Ownership is now set to 'nextjs' user and its primary group (also 'nextjs')
COPY --chown=nextjs:nextjs ./.next/standalone ./
# Copy static assets (e.g., built JS, CSS files)
COPY --chown=nextjs:nextjs ./.next/static ./.next/static
# Copy public assets (e.g., favicon, robots.txt)
COPY --chown=nextjs:nextjs ./public ./public

# Switch to the non-root user
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js server
CMD ["node", "server.js"]
