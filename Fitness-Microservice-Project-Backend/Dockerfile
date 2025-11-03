# Start from Java 17
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml first
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Pre-download dependencies (to speed up builds)
RUN ./mvnw dependency:go-offline

# Copy project source and build
COPY src src
RUN ./mvnw clean package -DskipTests

# Run the JAR file
EXPOSE 8080
CMD ["java", "-jar", "target/*.jar"]
