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
    libicu76 \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
ARG USERNAME=dev
ARG USER_UID=1001
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m -s /bin/zsh $USERNAME \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# temp fix for libicui18n.so.74 not found error
RUN ln -s /usr/lib/x86_64-linux-gnu/libicui18n.so.76 \
    /usr/lib/x86_64-linux-gnu/libicui18n.so.74

# Install oh-my-zsh for dev user
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
RUN SHELL=zsh pnpm setup

# AI agent tools
RUN curl -fsSL https://claude.ai/install.sh | bash

# Claude memory and specs
RUN curl -L https://github.com/dolthub/dolt/releases/latest/download/install.sh | bash
RUN curl -fsSL https://raw.githubusercontent.com/steveyegge/beads/main/scripts/install.sh | bash
RUN npm install -g @fission-ai/openspec

# Sanity check
RUN pnpm --version && dolt version && bd --version && openspec --version

# Set working directory
USER $USERNAME
WORKDIR /blog

# Default command
CMD ["sleep", "infinity"]
