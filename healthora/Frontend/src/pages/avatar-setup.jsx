import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import "../styles/avatar-setup.css";

const avatarPresets = [
  { id: "sunny", name: "Sunny", emoji: "🧑🏻‍🦱" },
  { id: "alex", name: "Alex", emoji: "👨🏽‍🦱" },
  { id: "mia", name: "Mia", emoji: "👩🏼‍🦰" },
  { id: "river", name: "River", emoji: "🧑🏾‍🦱" },
  { id: "jordan", name: "Jordan", emoji: "👩🏻‍🦱" },
  { id: "sky", name: "Sky", emoji: "🧑🏿‍🦱" },
];

const skinTones = [
  { name: "Light", value: "#F6D4B8" },
  { name: "Fair", value: "#E9B994" },
  { name: "Medium", value: "#C98D62" },
  { name: "Tan", value: "#A96D49" },
  { name: "Deep", value: "#75452F" },
];

const hairColors = [
  { name: "Black", value: "#292522" },
  { name: "Brown", value: "#70452F" },
  { name: "Blonde", value: "#D9B45B" },
  { name: "Red", value: "#AD4939" },
  { name: "Purple", value: "#9065B8" },
];

const hairstyles = [
  { name: "Curly", value: "🦱" },
  { name: "Straight", value: "💇" },
  { name: "Short", value: "✂️" },
  { name: "Wavy", value: "〰️" },
];

const outfits = [
  { name: "Mint", value: "#9BD9B0" },
  { name: "Blue", value: "#8CBDEB" },
  { name: "Lavender", value: "#C6A8E8" },
  { name: "Coral", value: "#F3A18F" },
  { name: "Yellow", value: "#F0D477" },
];

function AvatarSetup() {
  const navigate = useNavigate();

  const [selectedPreset, setSelectedPreset] = useState(avatarPresets[0]);
  const [skinTone, setSkinTone] = useState(skinTones[1].value);
  const [hairColor, setHairColor] = useState(hairColors[0].value);
  const [hairstyle, setHairstyle] = useState(hairstyles[0].name);
  const [outfit, setOutfit] = useState(outfits[0].value);
  const [saving, setSaving] = useState(false);

 const saveAvatar = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please log in to create your avatar.");
      navigate("/login");
      return;
    }

    setSaving(true);

    const avatarData = {
      preset: selectedPreset.id,
      skinTone,
      hairColor,
      hairstyle,
      outfit,
    };

    try {
      // Save avatar to the signed-in user's Firestore document
      await setDoc(
        doc(db, "users", user.uid),
        {
          avatar: avatarData,
          avatarSetupComplete: true,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      // Keep a local copy for existing frontend features
      localStorage.setItem(
        `healthoraAvatar_${user.uid}`,
        JSON.stringify(avatarData)
      );

      localStorage.setItem(
        `healthoraAvatarSetupComplete_${user.uid}`,
        "true"
      );

      window.location.href = "/dashboard.html";
    } catch (error) {
      console.error("Avatar save error:", error);
      alert(
        "Avatar save nahi ho paya. Please check your internet connection and Firebase Firestore rules."
      );
      setSaving(false);
    }
  };

  return (
    <main className="avatar-setup-page">
      <header className="avatar-setup-header">
        <div className="avatar-brand-icon">♥</div>
        <div>
          <h1>Healthora</h1>
          <p>Your Health. Your Story.</p>
        </div>
      </header>

      <section className="avatar-setup-container">
        <div className="avatar-setup-intro">
          <span className="avatar-eyebrow">YOUR WELLNESS, YOUR STYLE</span>
          <h2>Meet your wellness avatar ✨</h2>
          <p>
            Create a little companion that represents you on your
            Healthora journey. You can change your look anytime.
          </p>
        </div>

        <div className="avatar-builder">
          <section className="avatar-preview-panel">
            <span className="avatar-preview-label">YOUR AVATAR</span>

            <div
              className="avatar-character"
              style={{ backgroundColor: outfit }}
            >
              <div
                className="avatar-face"
                style={{ backgroundColor: skinTone }}
              >
                <div
                  className="avatar-hair"
                  style={{ color: hairColor }}
                >
                  {hairstyles.find((item) => item.name === hairstyle)?.value}
                </div>

                <div className="avatar-eyes">
                  <span />
                  <span />
                </div>

                <div className="avatar-smile" />
              </div>
            </div>

            <h3>{selectedPreset.name}</h3>
            <p>Your wellness companion</p>
            <span className="avatar-preview-badge">
              🌿 Healthora Member
            </span>
          </section>

          <section className="avatar-options-panel">
            <div className="avatar-option-group">
              <h3>1. Choose your character</h3>

              <div className="avatar-preset-grid">
                {avatarPresets.map((preset) => (
                  <button
                    type="button"
                    key={preset.id}
                    className={
                      selectedPreset.id === preset.id
                        ? "avatar-preset selected"
                        : "avatar-preset"
                    }
                    onClick={() => setSelectedPreset(preset)}
                    aria-pressed={selectedPreset.id === preset.id}
                  >
                    <span>{preset.emoji}</span>
                    <small>{preset.name}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="avatar-option-group">
              <h3>2. Skin tone</h3>

              <div className="avatar-color-options">
                {skinTones.map((tone) => (
                  <button
                    type="button"
                    key={tone.name}
                    title={tone.name}
                    aria-label={tone.name}
                    aria-pressed={skinTone === tone.value}
                    className={
                      skinTone === tone.value
                        ? "avatar-color selected"
                        : "avatar-color"
                    }
                    style={{ backgroundColor: tone.value }}
                    onClick={() => setSkinTone(tone.value)}
                  />
                ))}
              </div>
            </div>

            <div className="avatar-option-group">
              <h3>3. Hair colour</h3>

              <div className="avatar-color-options">
                {hairColors.map((color) => (
                  <button
                    type="button"
                    key={color.name}
                    title={color.name}
                    aria-label={color.name}
                    aria-pressed={hairColor === color.value}
                    className={
                      hairColor === color.value
                        ? "avatar-color selected"
                        : "avatar-color"
                    }
                    style={{ backgroundColor: color.value }}
                    onClick={() => setHairColor(color.value)}
                  />
                ))}
              </div>
            </div>

            <div className="avatar-option-group">
              <h3>4. Hairstyle</h3>

              <div className="avatar-choice-row">
                {hairstyles.map((style) => (
                  <button
                    type="button"
                    key={style.name}
                    className={
                      hairstyle === style.name
                        ? "avatar-choice selected"
                        : "avatar-choice"
                    }
                    onClick={() => setHairstyle(style.name)}
                    aria-pressed={hairstyle === style.name}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="avatar-option-group">
              <h3>5. Outfit colour</h3>

              <div className="avatar-color-options">
                {outfits.map((color) => (
                  <button
                    type="button"
                    key={color.name}
                    title={color.name}
                    aria-label={color.name}
                    aria-pressed={outfit === color.value}
                    className={
                      outfit === color.value
                        ? "avatar-color selected"
                        : "avatar-color"
                    }
                    style={{ backgroundColor: color.value }}
                    onClick={() => setOutfit(color.value)}
                  />
                ))}
              </div>
            </div>

            <button
              type="button"
              className="avatar-save-button"
              onClick={saveAvatar}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Avatar & Continue →"}
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}

export default AvatarSetup;