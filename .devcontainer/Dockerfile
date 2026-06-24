FROM mcr.microsoft.com/devcontainers/typescript-node:24-trixie

RUN \
  apt-get update && \
  apt-get install -y --no-install-recommends \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
    fonts-noto-core \
    fonts-noto-mono \
  ;

COPY playwright-fonts.conf /etc/fonts/playwright-fonts.conf
ENV FONTCONFIG_FILE=/etc/fonts/playwright-fonts.conf
