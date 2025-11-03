# ---------- Build Stage ----------
FROM eclipse-temurin:23-jdk-alpine AS build
WORKDIR /app

# Copy Maven wrapper and project files
COPY mvnw . 
COPY .mvn .mvn
COPY pom.xml .
COPY src ./src

# Ensure mvnw is executable and build the jar
RUN chmod +x mvnw || true
RUN ./mvnw -B clean package -DskipTests

# ---------- Runtime Stage ----------
FROM eclipse-temurin:23-jre-alpine
WORKDIR /app

# Copy built jar from build stage
COPY --from=build /app/target/*.jar /app/app.jar

# Expose port dynamically via Render's SERVER_PORT env var
EXPOSE 8080
ENV SERVER_PORT=8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${SERVER_PORT} -jar /app/app.jar"]
