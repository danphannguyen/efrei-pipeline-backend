# Configuration Jenkins pour build/push Docker

1) Créer le jobs 
- Name: Deploy-Pipeline-Backend
- Type: Pipeline script from SCM
- Repository URL: https://github.com/danphannguyen/efrei-pipeline-backend.git
- Branch specifier: */main
- Script path: Jenkinsfile

- Variables d'environnement (à définir par job ou globalement) :
  - `DOCKERHUB_NAMESPACE` — votre nom d'utilisateur ou organisation Docker Hub (ex. `dvnpn`).
  - `DOCKERHUB_REPO_NAME` — nom du repository Docker Hub pour l'image backend (ex. `efrei-pipeline-api`). **Obligatoire**.
