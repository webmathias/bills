pipeline {
    agent { docker 'node:6.3' }
    stages {
        stage('build') {
            steps {
                sh 'npm --version'
                cd app
                sh 'npm run build'
            }
        }
    }
}
