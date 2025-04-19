body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background: #f9f9f9;
  color: #222;
}

header {
  text-align: center;
  background: #ffffff;
  padding: 1rem 0;
  border-bottom: 1px solid #ddd;
}

.logo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
}

.slogan {
  font-style: italic;
  color: #666;
  margin: 0.5rem 0;
}

.price a {
  color: #007bff;
  text-decoration: none;
}

#walletSection {
  text-align: center;
  margin-top: 1rem;
}

#walletDetails {
  margin-top: 0.5rem;
  font-size: 0.95rem;
}

nav {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  flex-wrap: wrap;
  background: #fff;
  border-bottom: 1px solid #ddd;
}

nav button {
  padding: 0.5rem 1rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

nav button.hidden {
  display: none;
}

section {
  max-width: 600px;
  margin: 2rem auto;
  background: white;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 0 8px rgba(0,0,0,0.05);
}

section.hidden {
  display: none;
}

input, textarea {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 6px;
}

button[type="submit"] {
  background-color: #28a745;
  color: white;
  font-weight: bold;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.post {
  border-bottom: 1px solid #eee;
  padding: 1rem 0;
}

.post h3 {
  margin: 0 0 0.5rem;
}

.post button {
  margin-right: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  cursor: pointer;
}

footer {
  text-align: center;
  font-size: 0.85rem;
  padding: 2rem 0;
  color: #666;
  background: #f1f1f1;
  margin-top: 2rem;
}

@media (max-width: 600px) {
  nav {
    flex-direction: column;
  }

  section {
    margin: 1rem;
  }
}
