# Development container for Astro.js blog
FROM node:22-bookworm

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
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# Install Claude CLI
RUN npm install -g @anthropic-ai/claude-code

# Create non-root user
ARG USERNAME=vscode
ARG USER_UID=1001
ARG USER_GID=$USER_UID

RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m -s /bin/zsh $USERNAME \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Install oh-my-zsh for vscode user
USER $USERNAME
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended

# Install Claude plugins from config file
COPY --chown=$USER_UID:$USER_GID claude.plugins.json /tmp/claude.plugins.json
RUN plugin=$(tr -d '[]" \n\t' < /tmp/claude.plugins.json) && \
    for p in $(echo "$plugin" | tr ',' '\n'); do \
    if [ -n "$p" ]; then \
    echo "Installing plugin: $p"; \
    claude plugin marketplace add "$p" && \
    name=$(echo "$p" | cut -d'/' -f2) && \
    claude plugin install "$name"; \
    fi; \
    done && rm /tmp/claude.plugins.json

# Set working directory
WORKDIR /workspace

# Default command
CMD ["sleep", "infinity"]
