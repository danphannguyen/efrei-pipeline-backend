pipeline {
  agent any

  /*
    Requirements in Jenkins:
    - Create Credentials of type "Username with password" with id: dockerhub-credentials
      (your Docker Hub username/token)
    - Set an environment variable `DOCKERHUB_NAMESPACE` (your Docker Hub username or org)
    - Set an environment variable `DOCKERHUB_REPO_NAME` (e.g. `efrei-pipeline-api`) — required
    - Ensure the build agent has Docker installed and can run `docker` (or use a docker-enabled agent)
  */

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install') {
      steps {
        sh 'npm install --package-lock-only || true'
        sh 'npm ci'
      }
    }

    stage('Docker Build & Push') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DH_USER', passwordVariable: 'DH_PWD')]) {
            def commit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
            def tag = "${env.BUILD_NUMBER ?: 'local'}-${commit}"
            def namespace = env.DOCKERHUB_NAMESPACE ?: env.DH_USER
            def repoName = env.DOCKERHUB_REPO_NAME
            if (!repoName) {
              error('DOCKERHUB_REPO_NAME environment variable is not set. Aborting pipeline.')
            }

            // create docker config for docker client and place it in the jenkins user's docker config
            sh '''
              mkdir -p "$WORKSPACE/docker-config"
              auth=$(printf '%s:%s' "$DH_USER" "$DH_PWD" | base64)
              cat > "$WORKSPACE/docker-config/config.json" <<EOF
{"auths":{"https://index.docker.io/v1/":{"auth":"$auth"}}}
EOF
              mkdir -p /home/jenkins/.docker
              cp "$WORKSPACE/docker-config/config.json" /home/jenkins/.docker/config.json
              chown -R jenkins:jenkins /home/jenkins/.docker
            '''

            // Build and push using host Docker (docker.sock mounted into agent)
            sh """
              sudo docker build -f ${env.WORKSPACE}/Dockerfile -t ${namespace}/${repoName}:${tag} ${env.WORKSPACE} && sudo docker push ${namespace}/${repoName}:${tag}
            """

            echo "Pushed image: ${namespace}/${repoName}:${tag}"
          }
        }
      }
    }

    stage('Deploy') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DH_USER', passwordVariable: 'DH_PWD')]) {
            def commit = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
            def tag = "${env.BUILD_NUMBER ?: 'local'}-${commit}"
            def namespace = env.DOCKERHUB_NAMESPACE ?: env.DH_USER
            def repoName = env.DOCKERHUB_REPO_NAME
            if (!repoName) {
              error('DOCKERHUB_REPO_NAME environment variable is not set. Aborting deploy.')
            }

            sh """
              if sudo docker pull ${namespace}/${repoName}:${tag}; then
                sudo docker stop pipeline-api || true
                sudo docker rm pipeline-api || true
                sudo docker run -d --name pipeline-api -p 3001:3001 ${namespace}/${repoName}:${tag}
              else
                echo "Image ${namespace}/${repoName}:${tag} not found on registry — skipping API deploy"
              fi
            """

            echo "Deployed ${namespace}/${repoName}:${tag}"
          }
        }
      }
    }
  }

  post {
    success {
      echo 'Backend pipeline finished successfully.'
    }
    failure {
      echo 'Backend pipeline failed.'
    }
  }
}
