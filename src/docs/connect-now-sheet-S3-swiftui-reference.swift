// ════════════════════════════════════════════════════════════════════
// Connect Now Bottom Sheet — SwiftUI Reference (Solution 3, Subtitle ON)
// ════════════════════════════════════════════════════════════════════
//
// PURPOSE: Reference implementation for iOS developers.
// This is NOT production code — it illustrates structure, states,
// animations, and data flow matching the React/Framer Motion prototype.
//
// Key differences from React version this file accounts for:
//   - SwiftUI's native sheet/detent system vs. manual drag
//   - Combine/async-await vs. setTimeout
//   - @State/@Binding vs. React useState
//   - withAnimation / .animation vs. CSS transitions
//   - matchedGeometryEffect where useful
//
// ════════════════════════════════════════════════════════════════════

import SwiftUI

// MARK: - Constants

private enum SheetConstants {
    static let maxChars = 700
    static let minChars = 10
    static let typingSpeedMs: UInt64 = 40_000_000 // 40ms in nanoseconds
    static let generateDelayMs: UInt64 = 1_200_000_000 // 1.2s
    static let sendDelayMs: UInt64 = 2_000_000_000 // 2s
    static let dismissThreshold: CGFloat = 120
    static let swipeThreshold: CGFloat = 50

    // Regex: 5+ consecutive digits with optional separators
    static let phoneRegex = /(?:\+?\d[\d\s\-().]{4,}\d|\b\d{5,}\b)/

    static let connectGradient = LinearGradient(
        gradient: Gradient(colors: [
            Color(red: 10/255, green: 164/255, blue: 184/255),
            Color(red: 9/255, green: 191/255, blue: 108/255)
        ]),
        startPoint: .bottomLeading,
        endPoint: .topTrailing
    )

    static let siaGradient = LinearGradient(
        gradient: Gradient(stops: [
            .init(color: Color(red: 1, green: 90/255, blue: 96/255), location: 0.05),
            .init(color: Color(red: 204/255, green: 122/255, blue: 255/255), location: 0.3625),
            .init(color: Color(red: 0, green: 148/255, blue: 1), location: 0.775),
            .init(color: Color(red: 0, green: 188/255, blue: 213/255), location: 1.0),
        ]),
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}


// MARK: - Data Models

struct Profile: Identifiable {
    let id: String
    let name: String
    let age: Int
    let community: String
    let profession: String
    let avatarURL: URL?
    let fullImageURL: URL?
    let isPremium: Bool
    let isOnline: Bool

    var firstName: String {
        name.components(separatedBy: " ").first ?? name
    }
}

enum SheetPhase: Equatable {
    case generating
    case typing
    case ready
}


// MARK: - View Model

@MainActor
final class ConnectSheetViewModel: ObservableObject {

    // ── Inputs ──
    let profile: Profile
    let savedMessage: String
    let isFirstConnect: Bool
    var onSend: ((String, Bool) -> Void)?
    var onClose: (() -> Void)?

    // ── State ──
    @Published var message: String = ""
    @Published var phase: SheetPhase = .ready
    @Published var typedWordCount: Int = 0
    @Published var isSending: Bool = false
    @Published var phoneError: Bool = false
    @Published var messageHistory: [String] = []
    @Published var historyIndex: Int = 0

    // ── Computed ──
    var isReady: Bool { phase == .ready }
    var isBusy: Bool { phase == .generating || phase == .typing }
    var isValid: Bool { isReady && message.trimmingCharacters(in: .whitespacesAndNewlines).count >= SheetConstants.minChars && !isSending }
    var firstName: String { profile.firstName }

    var typedText: String {
        guard phase == .typing else { return message }
        let words = message.components(separatedBy: .whitespaces).filter { !$0.isEmpty }
        return words.prefix(typedWordCount).joined(separator: " ")
    }

    var historyDisplay: String {
        let count = isBusy ? max(messageHistory.count + 1, 2) : max(messageHistory.count, 1)
        let idx = isBusy ? count : (messageHistory.isEmpty ? 1 : historyIndex + 1)
        return "\(idx)/\(count)"
    }

    var canGoPrev: Bool { isReady && historyIndex > 0 }
    var canGoNext: Bool { isReady && historyIndex < messageHistory.count - 1 }
    var creditsLeft: Int { max(0, 5 - messageHistory.count) }

    // ── Tasks ──
    private var generateTask: Task<Void, Never>?
    private var typingTask: Task<Void, Never>?
    private var sendTask: Task<Void, Never>?

    // ── Init ──
    init(profile: Profile, savedMessage: String, isFirstConnect: Bool) {
        self.profile = profile
        self.savedMessage = savedMessage
        self.isFirstConnect = isFirstConnect
    }

    // ── Lifecycle ──

    func onAppear() {
        if isFirstConnect || savedMessage.isEmpty {
            startGenerating()
        } else {
            message = savedMessage
            phase = .ready
        }
    }

    func cleanup() {
        generateTask?.cancel()
        typingTask?.cancel()
        sendTask?.cancel()
        phase = .ready
        typedWordCount = 0
        messageHistory = []
        historyIndex = 0
        isSending = false
        phoneError = false
    }

    // ── Generate ──

    func startGenerating() {
        generateTask?.cancel()
        typingTask?.cancel()

        // Clear phone error (same as "Edit Message" / "Try another")
        if phoneError {
            withAnimation(.easeOut(duration: 0.2)) {
                phoneError = false
            }
        }

        // Save current to history
        if !message.isEmpty && !messageHistory.contains(message) {
            messageHistory.append(message)
        }

        withAnimation(.easeInOut(duration: 0.15)) {
            phase = .generating
        }

        generateTask = Task {
            try? await Task.sleep(nanoseconds: SheetConstants.generateDelayMs)
            guard !Task.isCancelled else { return }
            let generated = Self.generateAIMessage(for: profile)
            startTyping(generated)
        }
    }

    // ── Typing Engine ──

    private func startTyping(_ msg: String) {
        message = msg
        typedWordCount = 0

        withAnimation(.easeInOut(duration: 0.15)) {
            phase = .typing
        }

        let words = msg.components(separatedBy: .whitespaces).filter { !$0.isEmpty }

        typingTask = Task {
            for i in 1...words.count {
                try? await Task.sleep(nanoseconds: SheetConstants.typingSpeedMs)
                guard !Task.isCancelled else { return }
                typedWordCount = i
            }
            // Brief pause after typing completes
            try? await Task.sleep(nanoseconds: 300_000_000)
            guard !Task.isCancelled else { return }

            withAnimation(.easeInOut(duration: 0.15)) {
                phase = .ready
            }

            // Push to history
            if !messageHistory.contains(msg) {
                messageHistory.append(msg)
                historyIndex = messageHistory.count - 1
            }
        }
    }

    // ── History Navigation ──

    func goToPrevious() {
        guard canGoPrev else { return }
        historyIndex -= 1
        message = messageHistory[historyIndex]
    }

    func goToNext() {
        guard canGoNext else { return }
        historyIndex += 1
        message = messageHistory[historyIndex]
    }

    // ── Send ──

    func send() {
        guard message.trimmingCharacters(in: .whitespacesAndNewlines).count >= SheetConstants.minChars,
              !isSending else { return }

        withAnimation(.easeOut(duration: 0.2)) {
            phoneError = false
        }
        isSending = true

        sendTask = Task {
            // Simulated 2s API call
            try? await Task.sleep(nanoseconds: SheetConstants.sendDelayMs)
            guard !Task.isCancelled else { return }

            isSending = false

            if message.contains(SheetConstants.phoneRegex) {
                // Phone number detected
                withAnimation(.spring(response: 0.25, dampingFraction: 0.9)) {
                    phoneError = true
                }
            } else {
                // Clean — send and close
                onSend?(message.trimmingCharacters(in: .whitespacesAndNewlines), true)
            }
        }
    }

    // ── Message Editing ──

    func updateMessage(_ newValue: String) {
        guard newValue.count <= SheetConstants.maxChars else { return }
        message = newValue
        if phoneError {
            withAnimation(.easeOut(duration: 0.2)) {
                phoneError = false
            }
        }
    }

    func clearErrorAndFocus() {
        withAnimation(.easeOut(duration: 0.2)) {
            phoneError = false
        }
        // Focus is handled by @FocusState in the View
    }

    // ── AI Message Generator (mock) ──

    static func generateAIMessage(for profile: Profile) -> String {
        let name = profile.firstName
        let messages = [
            "Hi \(name), I came across your profile and really liked what you shared about yourself. I'm Pratik, and I think we could have some great conversations. Would love to get to know you better!",
            "Hey \(name)! Your profile really stood out to me. I'm Pratik, and I appreciate how genuine you come across. I'd love to connect and see where things go.",
            "Hi \(name), your profile caught my eye and I wanted to reach out! I'm Pratik, and I feel like we might have a lot in common. Looking forward to hearing from you!",
        ]
        return messages.randomElement()!
    }
}


// MARK: - Connect Now Bottom Sheet View

struct ConnectNowSheet: View {
    @StateObject var vm: ConnectSheetViewModel
    @FocusState private var isTextareaFocused: Bool
    @State private var dragOffset: CGFloat = 0

    var body: some View {
        ZStack(alignment: .bottom) {

            // ── Overlay ──
            Color.black.opacity(0.5)
                .ignoresSafeArea()
                .onTapGesture { vm.onClose?() }

            // ── Sheet ──
            VStack(spacing: 0) {
                dragHandle
                sheetContent
            }
            .background(Color("sheetBg"))
            .clipShape(RoundedRectangle(cornerRadius: 28, style: .continuous))
            .offset(y: max(0, dragOffset))
            .gesture(dismissDragGesture)
            .transition(.move(edge: .bottom))
        }
        .onAppear { vm.onAppear() }
        .onDisappear { vm.cleanup() }
    }

    // ── Drag Handle ──
    private var dragHandle: some View {
        VStack {
            Capsule()
                .fill(Color("border"))
                .frame(width: 40, height: 4)
        }
        .frame(maxWidth: .infinity)
        .padding(.top, 12)
        .padding(.bottom, 4)
        .contentShape(Rectangle())
    }

    // ── Dismiss Drag Gesture ──
    private var dismissDragGesture: some Gesture {
        DragGesture()
            .onChanged { value in
                if value.translation.height > 0 {
                    dragOffset = value.translation.height * 0.6
                }
            }
            .onEnded { value in
                if value.translation.height > SheetConstants.dismissThreshold ||
                   value.predictedEndTranslation.height > 300 {
                    vm.onClose?()
                } else {
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.8)) {
                        dragOffset = 0
                    }
                }
            }
    }

    // ── Sheet Content ──
    private var sheetContent: some View {
        VStack(spacing: 0) {

            // Avatar + Title + Subtitle
            headerSection

            // Compose Card
            composeCard
                .padding(.top, 16)

            // Phone Error Message
            phoneErrorBanner

            // CTA Area
            ctaArea

            // Footer
            footerText
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 32)
    }

    // ═══════════════════════════════════════════
    // HEADER: Avatar + Title + Subtitle
    // ═══════════════════════════════════════════

    private var headerSection: some View {
        VStack(spacing: 10) {
            // Avatar — 64px round
            AsyncImage(url: vm.profile.avatarURL) { image in
                image.resizable().aspectRatio(contentMode: .fill)
            } placeholder: {
                Circle().fill(Color.gray.opacity(0.3))
            }
            .frame(width: 64, height: 64)
            .clipShape(Circle())
            .overlay(Circle().stroke(Color.black.opacity(0.1), lineWidth: 0.5))

            VStack(spacing: 2) {
                // Title
                Text("Connect with \(vm.firstName)")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundStyle(Color("foreground"))

                // Subtitle
                Text("Your first Message matters. Make it personal.")
                    .font(.system(size: 14, weight: .regular))
                    .foregroundStyle(Color("mutedForeground"))
            }
        }
        .padding(.top, 16)
    }

    // ═══════════════════════════════════════════
    // COMPOSE CARD
    // ═══════════════════════════════════════════

    private var composeCard: some View {
        VStack(spacing: 0) {
            // Message area — 140px fixed height
            ZStack {
                // Phase: Generating
                generatingPhaseView
                    .opacity(vm.phase == .generating ? 1 : 0)
                    .allowsHitTesting(vm.phase == .generating)

                // Phase: Typing
                typingPhaseView
                    .opacity(vm.phase == .typing ? 1 : 0)
                    .allowsHitTesting(vm.phase == .typing)

                // Phase: Ready (editable textarea)
                readyPhaseView
                    .opacity(vm.phase == .ready ? 1 : 0)
                    .allowsHitTesting(vm.phase == .ready)
            }
            .frame(height: 140)
            .padding(.horizontal, 14)
            .padding(.top, 14)
            .padding(.bottom, 8)
            .animation(.easeInOut(duration: 0.15), value: vm.phase)

            // Bottom row: arrows + SIA pill
            bottomRow
                .padding(.horizontal, 6)
                .padding(.bottom, 12)
                .padding(.top, 4)
                .opacity(vm.isReady ? 1 : 0)
                .allowsHitTesting(vm.isReady)
                .animation(.easeInOut(duration: 0.2), value: vm.isReady)
        }
        .background(Color("composeCardBg"))
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(Color("composeCardBorder"), lineWidth: 1)
        )
    }

    // ── Phase: Generating ──
    private var generatingPhaseView: some View {
        HStack(spacing: 10) {
            // SIA Logo V4 — flower rotates, star+gradient static
            SIALogoView(size: 20)
            Text("SIA is writing your message...")
                .font(.system(size: 14, weight: .regular))
                .foregroundStyle(Color("mutedForeground"))
            Spacer()
        }
        .padding(.top, 2)
    }

    // ── Phase: Typing ──
    private var typingPhaseView: some View {
        HStack {
            Text(vm.typedText)
                .font(.system(size: 16, weight: .regular))
                .lineSpacing(8)
                .foregroundStyle(Color("foreground"))
            + Text("|") // Blinking cursor approximation
                .font(.system(size: 16, weight: .regular))
                .foregroundStyle(Color("brand500"))
            Spacer()
        }
    }

    // ── Phase: Ready ──
    private var readyPhaseView: some View {
        TextEditor(text: Binding(
            get: { vm.message },
            set: { vm.updateMessage($0) }
        ))
        .font(.system(size: 16, weight: .regular))
        .lineSpacing(8)
        .foregroundStyle(Color("foreground"))
        .scrollContentBackground(.hidden)
        .focused($isTextareaFocused)
    }

    // ── Bottom Row ──
    private var bottomRow: some View {
        HStack {
            // Left: History navigation (when showStats)
            Spacer()

            // Right: SIA action pill
            siaPillButton
        }
    }

    // ── SIA Pill Button ──
    private var siaPillButton: some View {
        Button(action: { vm.startGenerating() }) {
            HStack(spacing: 4) {
                if vm.message.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                    // Sparkle icon + "Write with SIA"
                    Image(systemName: "sparkles")
                        .font(.system(size: 13))
                    Text("Write with SIA")
                        .font(.system(size: 14, weight: .medium))
                } else {
                    // Retry icon + "Try another"
                    Image(systemName: "arrow.trianglehead.2.counterclockwise")
                        .font(.system(size: 13))
                    Text("Try another")
                        .font(.system(size: 14, weight: .medium))
                }
            }
            .foregroundStyle(Color("foreground"))
            .padding(.horizontal, 10)
            .frame(height: 32)
            .background(Color("siaPillBg"))
            .clipShape(Capsule())
        }
        .background(
            Capsule()
                .fill(SheetConstants.siaGradient)
                .padding(-1.5)
        )
        .disabled(vm.isBusy)
        .opacity(vm.isBusy ? 0.4 : 1)
    }

    // ═══════════════════════════════════════════
    // PHONE ERROR BANNER
    // ═══════════════════════════════════════════

    private var phoneErrorBanner: some View {
        Group {
            if vm.phoneError {
                HStack(spacing: 6) {
                    // Warning icon
                    Image(systemName: "exclamationmark.circle")
                        .font(.system(size: 14))
                        .foregroundStyle(Color("accentPalette700"))

                    Text("Only Premium Members can share Contact details")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(Color("accentPalette700"))
                }
                .padding(.horizontal, 4)
                .padding(.top, 8)
                .transition(.opacity.combined(with: .offset(y: -4)))
            }
        }
        .animation(.easeOut(duration: 0.2), value: vm.phoneError)
    }

    // ═══════════════════════════════════════════
    // CTA AREA
    // Both states always in the view tree.
    // Crossfade via opacity — no conditional removal.
    // Container height animates between 48px and 106px.
    // ═══════════════════════════════════════════

    private var ctaArea: some View {
        ZStack(alignment: .top) {

            // Layer: Error CTAs (Upgrade Now + Edit Message)
            VStack(spacing: 10) {
                upgradeNowButton
                editMessageButton
            }
            .opacity(vm.phoneError ? 1 : 0)
            .allowsHitTesting(vm.phoneError)
            .zIndex(vm.phoneError ? 2 : 0)

            // Layer: Connect Now gradient CTA
            connectNowButton
                .opacity(vm.phoneError ? 0 : (vm.isValid || vm.isSending ? 1 : 0.5))
                .allowsHitTesting(!vm.phoneError)
                .zIndex(vm.phoneError ? 0 : 2)
        }
        .frame(height: vm.phoneError ? 106 : 48)
        .animation(.easeInOut(duration: 0.25), value: vm.phoneError)
        .padding(.top, 14)
    }

    // ── Connect Now Button ──
    private var connectNowButton: some View {
        Button(action: { vm.send() }) {
            ZStack {
                if vm.isSending {
                    // Spinning loader
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .scaleEffect(1.2)
                } else {
                    HStack(spacing: 3) {
                        // Checkmark icon
                        Image(systemName: "checkmark")
                            .font(.system(size: 16, weight: .bold))
                        Text("Connect Now")
                            .font(.system(size: 16, weight: .bold))
                    }
                }
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .frame(height: 48)
            .background(SheetConstants.connectGradient)
            .clipShape(Capsule())
            .shadow(color: Color(red: 10/255, green: 164/255, blue: 184/255).opacity(0.2),
                    radius: 8, y: 4)
        }
        .disabled(!vm.isValid && !vm.isSending)
        .buttonStyle(ScaleButtonStyle())
    }

    // ── Upgrade Now Button ──
    private var upgradeNowButton: some View {
        Button(action: {
            // Navigate to premium upgrade flow
        }) {
            HStack(spacing: 8) {
                // Crown icon from design system
                Image(systemName: "crown.fill")
                    .font(.system(size: 16))
                Text("Upgrade Now")
                    .font(.system(size: 16, weight: .bold))
            }
            .foregroundStyle(.white)
            .frame(maxWidth: .infinity)
            .frame(height: 48)
            .background(Color("primary"))
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        }
    }

    // ── Edit Message Button ──
    private var editMessageButton: some View {
        Button(action: {
            vm.clearErrorAndFocus()
            // Delay focus slightly for state to settle
            DispatchQueue.main.asyncAfter(deadline: .now() + 0.05) {
                isTextareaFocused = true
            }
        }) {
            Text("Edit Message")
                .font(.system(size: 16, weight: .medium))
                .foregroundStyle(Color("foreground"))
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .background(Color("secondaryButtonBg"))
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        }
    }

    // ═══════════════════════════════════════════
    // FOOTER
    // ═══════════════════════════════════════════

    private var footerText: some View {
        Text("Your Message will be personalized for each Profile.")
            .font(.system(size: 12, weight: .regular))
            .foregroundStyle(Color("mutedForeground"))
            .multilineTextAlignment(.center)
            .padding(.top, 8)
            .opacity(vm.phoneError ? 0 : (vm.isBusy ? 0.4 : 1))
            .frame(maxHeight: vm.phoneError ? 0 : .infinity)
            .clipped()
            .animation(.easeInOut(duration: 0.25), value: vm.phoneError)
    }
}


// MARK: - SIA Logo (Simplified)

/// Placeholder for the SIA logo with rotating flower animation.
/// In production, replace with the actual SVG paths from the design system.
struct SIALogoView: View {
    let size: CGFloat
    @State private var rotation: Double = 0

    var body: some View {
        ZStack {
            // Flower shape (rotates) — replace with actual SVG path
            Image(systemName: "leaf.fill")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .foregroundStyle(
                    LinearGradient(
                        colors: [.pink, .purple, .cyan],
                        startPoint: .topTrailing,
                        endPoint: .bottomLeading
                    )
                )
                .rotationEffect(.degrees(rotation))

            // Star (static) — replace with actual SVG path
            Image(systemName: "sparkle")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .foregroundStyle(.white)
                .frame(width: size * 0.4, height: size * 0.4)
        }
        .frame(width: size, height: size)
        .onAppear {
            withAnimation(.linear(duration: 1.6).repeatForever(autoreverses: false)) {
                rotation = 360
            }
        }
    }
}


// MARK: - Button Style

struct ScaleButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.98 : 1)
            .animation(.easeOut(duration: 0.1), value: configuration.isPressed)
    }
}


// MARK: - Profile Card Pre-Connect CTA (Solution 3)

/// The bottom CTA area of a Profile Card, Solution 3.
/// Shows different layouts based on whether a saved message exists.
struct ProfileCardS3CTA: View {
    let profile: Profile
    let isConnected: Bool
    let savedMessage: String?
    let isFirstConnect: Bool
    var onConnect: ((Profile) -> Void)?
    var onEditMessage: ((Profile) -> Void)?

    private var hasNote: Bool { !isFirstConnect && savedMessage != nil && !savedMessage!.isEmpty }

    var body: some View {
        ZStack(alignment: .top) {

            // PRE-CONNECT
            Group {
                if hasNote {
                    noteAwareCTA
                } else {
                    standardCTA
                }
            }
            .opacity(isConnected ? 0 : 1)
            .offset(y: isConnected ? -8 : 0)
            .allowsHitTesting(!isConnected)

            // POST-CONNECT
            postConnectCTAs
                .opacity(isConnected ? 1 : 0)
                .offset(y: isConnected ? 0 : 20)
                .allowsHitTesting(isConnected)
        }
        .frame(height: isConnected ? 126 : (hasNote ? 88 : 76))
        .animation(.easeInOut(duration: 0.4), value: isConnected)
    }

    // ── Standard (first connect): "Like this profile?" + circular button ──
    private var standardCTA: some View {
        VStack(spacing: 0) {
            Divider().opacity(0.1)
            HStack(spacing: 16) {
                HStack(spacing: 8) {
                    Text("Like this profile?")
                        .font(.system(size: 14, weight: .light))
                        .italic()
                        .foregroundStyle(.white)
                    Text("Connect Now")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundStyle(Color(red: 38/255, green: 208/255, blue: 206/255))
                }
                Button(action: { onConnect?(profile) }) {
                    Image(systemName: "checkmark")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundStyle(.white)
                        .frame(width: 52, height: 52)
                        .background(SheetConstants.connectGradient)
                        .clipShape(Circle())
                        .shadow(color: .black.opacity(0.2), radius: 8, y: 4)
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .padding(.horizontal, 12)
        }
    }

    // ── Note-aware (subsequent): Full-width button + message preview ──
    private var noteAwareCTA: some View {
        VStack(spacing: 6) {
            // Full-width Connect Now button (44px)
            Button(action: { onConnect?(profile) }) {
                HStack(spacing: 8) {
                    Image(systemName: "checkmark")
                        .font(.system(size: 16, weight: .bold))
                    Text("Connect Now")
                        .font(.system(size: 16, weight: .bold))
                }
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 44)
                .background(SheetConstants.connectGradient)
                .clipShape(Capsule())
                .shadow(color: Color(red: 10/255, green: 164/255, blue: 184/255).opacity(0.3),
                        radius: 5, y: 2)
            }
            .buttonStyle(ScaleButtonStyle())

            // Message preview tile
            Button(action: { onEditMessage?(profile) }) {
                HStack(spacing: 8) {
                    Image(systemName: "bubble.left")
                        .font(.system(size: 12))
                        .foregroundStyle(.white.opacity(0.7))

                    Text(truncatedPreview)
                        .font(.system(size: 12, weight: .light))
                        .foregroundStyle(.white.opacity(0.9))
                        .lineLimit(1)
                        .frame(maxWidth: .infinity, alignment: .leading)

                    Text("Edit")
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(.white.opacity(0.85))
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 4.5)
                .background(Color.white.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                .overlay(
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .stroke(Color.white.opacity(0.2), lineWidth: 0.5)
                )
            }
        }
        .padding(.horizontal, 12)
        .padding(.bottom, 12)
    }

    private var truncatedPreview: String {
        guard let msg = savedMessage else { return "" }
        return msg.count > 38 ? String(msg.prefix(38)) + "..." : msg
    }

    // ── Post-Connect CTAs ──
    private var postConnectCTAs: some View {
        VStack(spacing: 10) {
            HStack(spacing: 4) {
                Text("To Contact her directly,")
                    .font(.system(size: 12, weight: .regular))
                    .foregroundStyle(Color("mutedForeground"))
                Button("Upgrade Now") { /* premium flow */ }
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundStyle(Color(red: 10/255, green: 164/255, blue: 184/255))
                Image(systemName: "chevron.right")
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundStyle(Color(red: 10/255, green: 164/255, blue: 184/255))
            }

            HStack(spacing: 0) {
                contactButton(icon: "bubble.left.fill", label: "Shaadi Chat", color: Color(red: 10/255, green: 164/255, blue: 184/255))
                Spacer()
                contactButton(icon: "phone.bubble.fill", label: "WhatsApp", color: .green)
                Spacer()
                contactButton(icon: "phone.fill", label: "Call", color: .blue)
            }
            .padding(.horizontal, 4)
        }
        .padding(.horizontal, 4)
        .padding(.vertical, 12)
        .background(Color("postConnectCtaBg"))
    }

    private func contactButton(icon: String, label: String, color: Color) -> some View {
        VStack(spacing: 6) {
            Image(systemName: icon)
                .font(.system(size: 20))
                .foregroundStyle(.white)
                .frame(width: 52, height: 52)
                .background(color)
                .clipShape(Circle())
                .shadow(color: .black.opacity(0.08), radius: 4, y: 4)
            Text(label)
                .font(.system(size: 11, weight: .light))
                .foregroundStyle(Color("foreground"))
        }
    }
}


// MARK: - Name Personalization Utility

/// Replaces the original Profile's first name with the new Profile's first name
/// using word-boundary matching.
func personalizeMessage(_ message: String, from originalName: String, to newName: String) -> String {
    guard !originalName.isEmpty, !newName.isEmpty, originalName != newName else { return message }
    // Word-boundary replacement
    let pattern = "\\b\(NSRegularExpression.escapedPattern(for: originalName))\\b"
    guard let regex = try? NSRegularExpression(pattern: pattern) else { return message }
    return regex.stringByReplacingMatches(
        in: message,
        range: NSRange(message.startIndex..., in: message),
        withTemplate: newName
    )
}


// MARK: - Usage Example (App-level coordinator)

/*
 @State private var connectingProfile: Profile?
 @State private var showConnectSheet = false
 @State private var savedConnectMessage = ""
 @State private var savedMessageFirstName = ""
 @State private var isFirstConnect = true
 @State private var autoSendEnabled = true
 @State private var connectedProfileIds: Set<String> = []

 func handleConnect(_ profile: Profile) {
     if connectedProfileIds.contains(profile.id) { return }

     if isFirstConnect || !autoSendEnabled {
         // Show full bottom sheet
         connectingProfile = profile
         showConnectSheet = true
     } else {
         // Auto-send with personalized saved message
         let personalized = personalizeMessage(
             savedConnectMessage,
             from: savedMessageFirstName,
             to: profile.firstName
         )
         connectedProfileIds.insert(profile.id)
         // Send personalized message via API...
     }
 }

 func handleSendConnect(message: String, autoSend: Bool) {
     guard let profile = connectingProfile else { return }
     savedConnectMessage = message
     savedMessageFirstName = profile.firstName
     autoSendEnabled = autoSend
     connectedProfileIds.insert(profile.id)
     isFirstConnect = false
     showConnectSheet = false

     // Delay clearing to let dismiss animation complete
     DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
         connectingProfile = nil
     }
 }

 func handleCloseSheet() {
     showConnectSheet = false
     DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
         connectingProfile = nil
     }
 }
*/
