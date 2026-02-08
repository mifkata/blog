# Development container for Astro.js blog
FROM node:22-trixie

# Avoid prompts from apt
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies
RUN apt-get update && apt-get install -y \
    curl \
    git \
    netcat-openbsd \
    sudo \
    vim \
    wget \
    zsh \
    gh \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
ARG USERNAME=dev
ARG USER_UID=1001
ARG USER_GID=$USER_UID
USER $USERNAME

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m -s /bin/zsh $USERNAME \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Install oh-my-zsh for dev user
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
RUN SHELL=zsh pnpm setup

# AI agent tools
RUN curl -fsSL https://claude.ai/install.sh | bash

# Claude memory and specs
RUN npm install -g @beads/bd

# Set working directory
WORKDIR /home/dev/app

# Default command
CMD ["sleep", "infinity"]
