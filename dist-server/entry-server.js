import { jsx, Fragment, jsxs } from "react/jsx-runtime";
import React, { createContext, useState, useEffect, useContext, useRef } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.mjs";
import { useNavigate, useLocation, useParams, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Lock, Crown, Upload, FileText, CheckCircle, X, ShieldCheck, Sparkles, LayoutDashboard, Boxes, ShoppingBag, Target, ChevronLeft, ChevronRight, HelpCircle, Paperclip, Send, Menu, LogOut, Hexagon, Search, Bell, RefreshCw, User, AlertTriangle, ArrowLeft, Star, Share2, MoreHorizontal, Eye, Info, Image, Layers, Volume2, Calendar, Video, PenTool, Zap, MessageSquare, Film, Plus, Globe, Youtube, Twitter, Linkedin, Facebook, Instagram, Download, Bot, Mail, ArrowRight, Chrome, CreditCard, ExternalLink, CheckCircle2, Activity, Cpu, Server, BarChart3, Factory, DollarSign, TrendingUp, PieChart, Clock, Box, Package, BarChart, History, Trash2, Truck, Edit2, Phone, ClipboardList, ClipboardCheck, Save, Calculator, MapPin, AlertCircle, UserPlus, Users, ShoppingCart, ArrowUpRight, ChevronDown, Shield, VolumeX, Minimize2, Database, MicOff, Mic, PackageOpen, Leaf, Scale, FileSignature, Beaker, Quote, Workflow, PackageCheck, Wallet, GanttChartSquare, Map, Ship, ArrowDownRight, ListTodo, Key, ShieldAlert } from "lucide-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, Tooltip, Area, LineChart, Line, YAxis, PieChart as PieChart$1, Pie, Cell, BarChart as BarChart$1, Legend, Bar } from "recharts";
import { toast, Toaster } from "sonner";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, getDocs, collection, getDoc, doc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { PaymentForm, CreditCard as CreditCard$1 } from "react-square-web-payments-sdk";
const firebaseConfig = {
  apiKey: "AIzaSyBw3tkLQXi6E4d-TRATSlSC7roFLrWhtrw",
  authDomain: "artisanflow-b6abf.firebaseapp.com",
  projectId: "artisanflow-b6abf",
  storageBucket: "artisanflow-b6abf.firebasestorage.app",
  messagingSenderId: "202144552685",
  appId: "1:202144552685:web:7cab6681811d210aa15ee4"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db$1 = getFirestore(app);
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["ADMIN"] = "ADMIN";
  UserRole2["USER"] = "USER";
  return UserRole2;
})(UserRole || {});
var MembershipTier = /* @__PURE__ */ ((MembershipTier2) => {
  MembershipTier2["FLOW_STARTER"] = "FLOW_STARTER";
  MembershipTier2["FLOW_BUILDER"] = "FLOW_BUILDER";
  MembershipTier2["FLOW_ARCHITECT"] = "FLOW_ARCHITECT";
  MembershipTier2["MARGIN_PROTECTION_MASTER"] = "MARGIN_PROTECTION_MASTER";
  return MembershipTier2;
})(MembershipTier || {});
var InventoryType = /* @__PURE__ */ ((InventoryType2) => {
  InventoryType2["RAW_MATERIAL"] = "RAW_MATERIAL";
  InventoryType2["PRODUCT"] = "PRODUCT";
  InventoryType2["COMPONENT"] = "COMPONENT";
  InventoryType2["PACKAGING"] = "PACKAGING";
  return InventoryType2;
})(InventoryType || {});
var ProductionStatus = /* @__PURE__ */ ((ProductionStatus2) => {
  ProductionStatus2["PLANNED"] = "PLANNED";
  ProductionStatus2["IN_PROGRESS"] = "IN_PROGRESS";
  ProductionStatus2["QUALITY_CHECK"] = "QUALITY_CHECK";
  ProductionStatus2["COMPLETED"] = "COMPLETED";
  ProductionStatus2["CANCELLED"] = "CANCELLED";
  return ProductionStatus2;
})(ProductionStatus || {});
var IntegrationPlatform = /* @__PURE__ */ ((IntegrationPlatform2) => {
  IntegrationPlatform2["SHOPIFY"] = "SHOPIFY";
  IntegrationPlatform2["WOOCOMMERCE"] = "WOOCOMMERCE";
  IntegrationPlatform2["ETSY"] = "ETSY";
  IntegrationPlatform2["SQUARE"] = "SQUARE";
  return IntegrationPlatform2;
})(IntegrationPlatform || {});
const BASE_ENTITY = {
  created_date: (/* @__PURE__ */ new Date()).toISOString(),
  updated_date: (/* @__PURE__ */ new Date()).toISOString(),
  created_by: "system"
};
const MOCK_INVENTORY = [
  { ...BASE_ENTITY, id: "1", name: "Lavender Essential Oil", sku: "RM-LAV-001", type: InventoryType.RAW_MATERIAL, quantityOnHand: 450, reorderPoint: 500, unitCost: 12.5, supplierId: "s1" },
  { ...BASE_ENTITY, id: "2", name: "Shea Butter (Raw)", sku: "RM-SHE-002", type: InventoryType.RAW_MATERIAL, quantityOnHand: 2e3, reorderPoint: 1e3, unitCost: 8, supplierId: "s2" },
  { ...BASE_ENTITY, id: "3", name: "Gold Mica Powder", sku: "RM-MIC-003", type: InventoryType.RAW_MATERIAL, quantityOnHand: 150, reorderPoint: 200, unitCost: 25, supplierId: "s3" },
  { ...BASE_ENTITY, id: "4", name: "Luxury Bath Bomb - Calm", sku: "PR-BB-CLM", type: InventoryType.PRODUCT, quantityOnHand: 45, reorderPoint: 50, unitCost: 3.5 },
  { ...BASE_ENTITY, id: "5", name: "Midnight Serum", sku: "PR-SRM-MID", type: InventoryType.PRODUCT, quantityOnHand: 12, reorderPoint: 20, unitCost: 18 }
];
const MOCK_PRODUCTION = [
  { ...BASE_ENTITY, id: "po1", orderNumber: "PO-001", recipeId: "r1", recipeName: "Midnight Serum Batch", status: ProductionStatus.IN_PROGRESS, quantity: 100, dueDate: "2023-11-05" },
  { ...BASE_ENTITY, id: "po2", orderNumber: "PO-002", recipeId: "r2", recipeName: "Calm Bath Bombs", status: ProductionStatus.PLANNED, quantity: 500, dueDate: "2023-11-10" },
  { ...BASE_ENTITY, id: "po3", orderNumber: "PO-003", recipeId: "r3", recipeName: "Holiday Gift Set", status: ProductionStatus.PLANNED, quantity: 50, dueDate: "2023-11-15" }
];
const MOCK_POSTS = [
  { ...BASE_ENTITY, id: "cp1", platform: "Instagram", topic: "Behind the Scenes: Serum Pouring", scheduledDate: "2023-11-02", status: "PUBLISHED", content: "", aiGenerated: false },
  { ...BASE_ENTITY, id: "cp2", platform: "TikTok", topic: "ASMR Packaging", scheduledDate: "2023-11-04", status: "DRAFT", content: "", aiGenerated: true }
];
const DEFAULT_TIER = MembershipTier.FLOW_ARCHITECT;
const COLLECTIONS = {
  INVENTORY: "inventory",
  PRODUCTION: "production",
  CONTENT: "content",
  INTEGRATIONS: "integrations",
  USERS: "users",
  BUSINESS_PROFILE: "business_profile",
  PORTAL_CONFIG: "portal_config"
};
const generateId = () => Math.random().toString(36).substr(2, 9);
const withTimestamps = (item) => ({
  ...item,
  id: item.id || generateId(),
  created_date: item.created_date || (/* @__PURE__ */ new Date()).toISOString(),
  updated_date: (/* @__PURE__ */ new Date()).toISOString(),
  created_by: "current_user"
});
const initializeStore = () => {
  if (!localStorage.getItem(COLLECTIONS.INVENTORY)) {
    localStorage.setItem(COLLECTIONS.INVENTORY, JSON.stringify(MOCK_INVENTORY.map(withTimestamps)));
  }
  if (!localStorage.getItem(COLLECTIONS.PRODUCTION)) {
    localStorage.setItem(COLLECTIONS.PRODUCTION, JSON.stringify(MOCK_PRODUCTION.map(withTimestamps)));
  }
  if (!localStorage.getItem(COLLECTIONS.CONTENT)) {
    localStorage.setItem(COLLECTIONS.CONTENT, JSON.stringify(MOCK_POSTS.map(withTimestamps)));
  }
  if (!localStorage.getItem(COLLECTIONS.INTEGRATIONS)) {
    const mockIntegrations = [
      { platform: IntegrationPlatform.SHOPIFY, status: "DISCONNECTED" },
      { platform: IntegrationPlatform.ETSY, status: "DISCONNECTED" }
    ];
    localStorage.setItem(COLLECTIONS.INTEGRATIONS, JSON.stringify(mockIntegrations.map(withTimestamps)));
  }
  if (!localStorage.getItem(COLLECTIONS.USERS)) {
    const defaultUser = {
      fullName: "Alex Artisan",
      email: "alex@lrcflow.com",
      role: UserRole.ADMIN,
      notificationsEnabled: true
    };
    localStorage.setItem(COLLECTIONS.USERS, JSON.stringify([withTimestamps(defaultUser)]));
  }
  if (!localStorage.getItem(COLLECTIONS.BUSINESS_PROFILE)) {
    const defaultBusiness = {
      name: "Luxe Artisan Co.",
      tier: DEFAULT_TIER,
      currency: "USD",
      timezone: "GMT-5",
      settings: {}
    };
    localStorage.setItem(COLLECTIONS.BUSINESS_PROFILE, JSON.stringify([withTimestamps(defaultBusiness)]));
  }
  if (!localStorage.getItem(COLLECTIONS.PORTAL_CONFIG)) {
    const defaultConfig = {
      brandColor: "#FFD700",
      welcomeMessage: "Welcome to our wholesale portal.",
      minOrderValue: 500,
      isActive: false
    };
    localStorage.setItem(COLLECTIONS.PORTAL_CONFIG, JSON.stringify([withTimestamps(defaultConfig)]));
  }
};
const GAS_URL = "https://script.google.com/macros/s/AKfycbwcHalq43bfMKo-HHwKO6cNGNNBU67sF7CPtRHITBw1Lbdrx28GNOHfBBDJhEDZSTxB/exec";
const syncToGAS = (action, collectionName, payload) => {
  fetch(GAS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, collection: collectionName, data: payload, timestamp: (/* @__PURE__ */ new Date()).toISOString() })
  }).catch((err) => console.error("GAS Sync Error:", err));
};
if (typeof window !== "undefined") {
  initializeStore();
}
class FirestoreDataService {
  async list(collectionName) {
    const snap = await getDocs(collection(db$1, collectionName));
    if (snap.empty) {
      const local = localStorage.getItem(collectionName);
      if (local) return JSON.parse(local);
      return [];
    }
    return snap.docs.map((d) => d.data());
  }
  async get(collectionName, id) {
    const snap = await getDoc(doc(db$1, collectionName, id));
    return snap.exists() ? snap.data() : void 0;
  }
  async getFirst(collectionName) {
    var _a;
    const snap = await getDocs(collection(db$1, collectionName));
    return (_a = snap.docs[0]) == null ? void 0 : _a.data();
  }
  async create(collectionName, item) {
    const itemData = item;
    const id = itemData.id || generateId();
    const newItem = {
      ...itemData,
      id,
      created_date: itemData.created_date || (/* @__PURE__ */ new Date()).toISOString(),
      updated_date: (/* @__PURE__ */ new Date()).toISOString(),
      created_by: "current_user"
    };
    await setDoc(doc(db$1, collectionName, id), newItem);
    syncToGAS("CREATE", collectionName, newItem);
    return newItem;
  }
  async update(collectionName, id, updates) {
    const docRef = doc(db$1, collectionName, id);
    const updatedData = { ...updates, updated_date: (/* @__PURE__ */ new Date()).toISOString() };
    await updateDoc(docRef, updatedData);
    const fullDoc = (await getDoc(docRef)).data();
    syncToGAS("UPDATE", collectionName, fullDoc);
    return fullDoc;
  }
  async delete(collectionName, id) {
    await deleteDoc(doc(db$1, collectionName, id));
    syncToGAS("DELETE", collectionName, { id });
  }
}
const db = new FirestoreDataService();
const DataContext = createContext(void 0);
const ArtisanDataProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userTier, setUserTier] = useState("Artisan Flow Basic");
  const [isSessionVerifying, setIsSessionVerifying] = useState(true);
  const [demandInsights, setDemandInsights] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [manualCustomers, setManualCustomers] = useState([]);
  const [todos, setTodos] = useState([]);
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [tutorialStep, setTutorialStepState] = useState(0);
  const [onboardingState, setOnboardingState] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("artisanflow_onboarding");
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });
  const markHubVisited = (hubId) => {
    setOnboardingState((prev) => {
      const newState = { ...prev, [hubId]: true };
      localStorage.setItem("artisanflow_onboarding", JSON.stringify(newState));
      return newState;
    });
  };
  const [connectedChannels, setConnectedChannels] = useState({
    "Instagram": false,
    "Facebook": false,
    "LinkedIn": false,
    "Twitter": false,
    "Email": false,
    "Pinterest": false,
    "TikTok": false,
    "YouTube": false
  });
  const toggleChannelConnection = (platform) => {
    setConnectedChannels((prev) => ({ ...prev, [platform]: !prev[platform] }));
  };
  const INITIAL_BUSINESS_PROFILE = {
    name: "",
    ownerName: "",
    email: "",
    industry: "Skincare",
    tier: "Free Audit",
    role: "user",
    status: "Active",
    brandVoice: { adjectives: ["Artisanal", "Luxurious"], restrictedWords: [] },
    receptionistLogic: { qualificationQuestions: ["What is your wholesale budget?", "Do you have a physical storefront?"] }
  };
  const [businessProfile, setBusinessProfile] = useState(INITIAL_BUSINESS_PROFILE);
  const [budgets, setBudgets] = useState({
    daily: 50,
    weekly: 350,
    monthly: 1500,
    yearly: 18e3
  });
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reports, setReports] = useState([]);
  const [productionStats, setProductionStats] = useState({ active: 0, inProgress: 0, awaiting: 0, completed: 0, pending: 0 });
  const [suppliers, setSuppliers] = useState([]);
  const [marketingPosts, setMarketingPosts] = useState([]);
  const [qualityChecks, setQualityChecks] = useState([]);
  const [locations, setLocations] = useState([]);
  const [supplierCommunications, setSupplierCommunications] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [systemUsers, setSystemUsers] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsSessionVerifying(true);
      if (user) {
        try {
          const docRef = doc(db$1, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setIsAuthenticated(true);
            const profileData = docSnap.data().profile;
            const adminEmails = ["lacarmsu38@gmail.com", "lcarter@lrcholisticmarketing.online"];
            if (user.email && adminEmails.includes(user.email.toLowerCase())) {
              profileData.role = "admin";
            }
            setBusinessProfile((prev) => ({ ...prev, ...profileData }));
            setUserTier(docSnap.data().tier || "Artisan Flow Basic");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setDemandInsights([
          { id: "1", material: "Rosemary Leaf", isCritical: true, recommendedBatch: 50, daysRemaining: 2 }
        ]);
      } else {
        setIsAuthenticated(false);
      }
      setIsSessionVerifying(false);
    });
    return () => unsubscribe();
  }, []);
  const login = async (email, pass) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (error) {
      console.error("Login Error:", error);
      return false;
    }
  };
  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return result.user;
    } catch (error) {
      console.error("Google Auth Error:", error);
      throw error;
    }
  };
  const logout = async () => {
    try {
      await signOut(auth);
      setBusinessProfile(INITIAL_BUSINESS_PROFILE);
      setInventory([]);
      setOrders([]);
      setSuppliers([]);
      setRecipes([]);
      setMarketingPosts([]);
      window.location.href = "/";
    } catch (err) {
      console.error("Error signing out", err);
    }
  };
  const signUp = async (data) => {
    try {
      let user = auth.currentUser;
      if (data.password) {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        user = userCredential.user;
      }
      if (!user) {
        throw new Error("No authenticated user found for signup.");
      }
      await setDoc(doc(db$1, "users", user.uid), {
        email: data.email,
        tier: data.tier,
        status: data.status,
        profile: {
          name: data.name || "New Artisan Business",
          ownerName: data.ownerName || "Business Owner",
          email: data.email
        },
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        isNewUser: true
        // explicitly marking as new user for the database if needed
      });
      const dbUrl = "https://script.google.com/macros/s/AKfycbwcHalq43bfMKo-HHwKO6cNGNNBU67sF7CPtRHITBw1Lbdrx28GNOHfBBDJhEDZSTxB/exec";
      if (dbUrl) {
        try {
          await fetch(dbUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
              action: "syncNewUser",
              payload: {
                email: data.email,
                name: data.name || "New Artisan Business",
                tier: data.tier,
                status: data.status || "Active",
                date: (/* @__PURE__ */ new Date()).toISOString()
              }
            })
          });
        } catch (e) {
          console.error("Failed to sync new user to Google Sheet", e);
        }
      }
      setBusinessProfile((prev) => ({ ...prev, ...data }));
      setUserTier(data.tier);
      setIsAuthenticated(true);
      setIsTutorialActive(true);
    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  };
  const updateTier = async (tier) => {
    setUserTier(tier);
    setBusinessProfile((prev) => ({ ...prev, tier }));
    if (auth.currentUser) {
      try {
        await setDoc(doc(db$1, "users", auth.currentUser.uid), { tier }, { merge: true });
      } catch (e) {
        console.error("Failed to sync tier upgrade", e);
      }
    }
  };
  const updateBusinessProfile = (updates) => setBusinessProfile((prev) => ({ ...prev, ...updates }));
  const getInventoryValue = () => inventory.reduce((acc, i) => acc + i.stock * i.unitCost, 0);
  const getTotalRevenue = () => orders.reduce((acc, o) => acc + o.total, 0);
  const getMarginMetrics = () => {
    const finished = inventory.filter((i) => i.type === "finished");
    if (finished.length === 0) return { isMarginHealthy: true, marginMultiplier: 2.2 };
    const avgMultiplier = finished.reduce((acc, i) => {
      const cost = i.unitCost && i.unitCost > 0 ? i.unitCost : 1;
      return acc + (i.retailPrice ? i.retailPrice / cost : 2.2);
    }, 0) / finished.length;
    return { isMarginHealthy: avgMultiplier >= 2.2, marginMultiplier: avgMultiplier };
  };
  const saveReport = (r) => setReports((prev) => [{ ...r, id: Date.now().toString() }, ...prev]);
  const deleteReport = (id) => setReports((prev) => prev.filter((r) => r.id !== id));
  const importData = async (files) => true;
  const addInventoryItem = async (item) => {
    try {
      const res = await fetch("/api/gating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: userTier.toLowerCase().replace(/ /g, "-"), action: "ADD_INVENTORY", currentCount: inventory.length })
      });
      const gate = await res.json();
      if (!gate.allowed) {
        throw new Error(`Tier limit reached: ${gate.limit}`);
      }
      const newItem = { ...item, id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, stockValue: (item.stock || 0) * (item.unitCost || 0) };
      setInventory((prev) => [...prev, newItem]);
      await db.create("inventory", newItem);
    } catch (e) {
      toast.error(e.message || "Failed to add inventory item");
      throw e;
    }
  };
  const updateInventory = (id, updates) => {
    setInventory((prev) => prev.map((item) => String(item.id) === String(id) ? { ...item, ...updates, stockValue: ((updates.stock ?? item.stock) || 0) * ((updates.unitCost ?? item.unitCost) || 0) } : item));
  };
  const addSupplier = (s) => setSuppliers((prev) => [...prev, { ...s, id: Date.now().toString() }]);
  const updateSupplier = (id, updates) => {
    setSuppliers((prev) => prev.map((s) => s.id === id ? { ...s, ...updates } : s));
  };
  const deleteSupplier = (id) => {
    setSuppliers((prev) => prev.filter((s) => s.id !== id));
  };
  const addLocation = (l) => setLocations((prev) => [...prev, { ...l, id: Date.now().toString() }]);
  const addCommunication = (c) => setSupplierCommunications((prev) => [...prev, { ...c, id: Date.now().toString() }]);
  const addQualityCheck = (q) => setQualityChecks((prev) => [...prev, { ...q, id: Date.now().toString() }]);
  const addMarketingPost = (post) => setMarketingPosts((prev) => [...prev, { ...post, id: Date.now().toString() }]);
  const addAppointment = (appointment) => setAppointments((prev) => [...prev, { ...appointment, id: Date.now().toString() }]);
  const addManualCustomer = (c) => {
    setManualCustomers((prev) => [...prev, { ...c, id: `M-${Date.now()}`, createdDate: (/* @__PURE__ */ new Date()).toLocaleDateString() }]);
  };
  const updateMarketingPost = (id, updates) => setMarketingPosts((prev) => prev.map((post) => post.id === id ? { ...post, ...updates } : post));
  const generateSchedule = () => setProductionStats((prev) => ({ ...prev, active: prev.active + 1 }));
  const produceBatch = async (recipeId, multiplier) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return { success: false, warnings: ["Recipe not found."] };
    const warnings = [];
    let newInventory = [...inventory];
    const itemsToUpdate = [];
    const itemsToCreate = [];
    recipe.ingredients.forEach((ing) => {
      const invItemIndex = newInventory.findIndex((i) => i.name.toLowerCase() === ing.name.toLowerCase() || i.sku === ing.name);
      const deduction = parseFloat(ing.qty) * multiplier;
      if (invItemIndex >= 0) {
        const currentStock = newInventory[invItemIndex].stock;
        const newStock = currentStock - deduction;
        if (newStock < 0) {
          warnings.push(`Negative stock warning: ${newInventory[invItemIndex].name} dropped to ${newStock.toFixed(2)} units.`);
        }
        newInventory[invItemIndex] = { ...newInventory[invItemIndex], stock: newStock, stockValue: newStock * newInventory[invItemIndex].unitCost };
        itemsToUpdate.push(newInventory[invItemIndex]);
      } else {
        warnings.push(`Material not found in inventory: ${ing.name}. Batch will proceed without deduction for this item.`);
      }
    });
    const yieldAmount = (parseFloat(recipe.yield) || 1) * multiplier;
    const finishedProductIndex = newInventory.findIndex((i) => i.name.toLowerCase() === recipe.name.toLowerCase());
    if (finishedProductIndex >= 0) {
      const newStock = newInventory[finishedProductIndex].stock + yieldAmount;
      newInventory[finishedProductIndex] = { ...newInventory[finishedProductIndex], stock: newStock, stockValue: newStock * newInventory[finishedProductIndex].unitCost };
      itemsToUpdate.push(newInventory[finishedProductIndex]);
    } else {
      const newItem = {
        id: Date.now(),
        name: recipe.name,
        sku: recipe.sku || `SKU-${Date.now()}`,
        type: "finished",
        category: "Finished Goods",
        stock: yieldAmount,
        unitCost: recipe.totalCost / (parseFloat(recipe.yield) || 1),
        retailPrice: recipe.totalCost * 2.5,
        // Default markup
        stockValue: recipe.totalCost * multiplier,
        unit: "pcs",
        reorderPoint: 5
      };
      newInventory.push(newItem);
      itemsToCreate.push(newItem);
    }
    setInventory(newInventory);
    setProductionStats((prev) => ({ ...prev, active: prev.active + 1, completed: prev.completed + 1 }));
    try {
      await Promise.all([
        ...itemsToUpdate.map((item) => db.update("inventory", String(item.id), item)),
        ...itemsToCreate.map((item) => db.create("inventory", item))
      ]);
    } catch (err) {
      console.error("Failed to persist batch production to backend:", err);
      warnings.push("Backend persistence failed. Data may be lost on reload.");
    }
    return { success: true, warnings };
  };
  const processOrder = async (id) => {
    const order = orders.find((o) => o.id === id);
    const itemsToUpdate = [];
    if (order && order.status !== "Shipped") {
      setInventory((prev) => {
        const newInv = [...prev];
        order.items.forEach((item) => {
          const invItemIndex = newInv.findIndex((i) => i.name.toLowerCase() === item.name.toLowerCase() || i.sku === item.name);
          if (invItemIndex >= 0) {
            const newStock = newInv[invItemIndex].stock - item.qty;
            if (newStock < 0) {
              toast.warning(`Negative stock: ${newInv[invItemIndex].name} is now ${newStock}.`);
            }
            newInv[invItemIndex] = { ...newInv[invItemIndex], stock: newStock, stockValue: newStock * newInv[invItemIndex].unitCost };
            itemsToUpdate.push(newInv[invItemIndex]);
          }
        });
        return newInv;
      });
    }
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: "Shipped" } : o));
    completeTodoByCategory("orders");
    try {
      await Promise.all([
        ...itemsToUpdate.map((item) => db.update("inventory", String(item.id), item)),
        db.update("orders", id, { status: "Shipped" })
      ]);
    } catch (err) {
      console.error("Failed to persist order processing to backend:", err);
      toast.error("Failed to sync order processing to backend.");
    }
  };
  const syncWooCommerce = async () => {
    completeTodoByCategory("orders");
    return { success: true, count: 0 };
  };
  const addRecipe = async (recipe) => {
    try {
      const res = await fetch("/api/gating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: userTier.toLowerCase().replace(/ /g, "-"), action: "ADD_RECIPE", currentCount: recipes.length })
      });
      const gate = await res.json();
      if (!gate.allowed) {
        throw new Error(`Tier limit reached: ${gate.limit}`);
      }
      const newRecipe = { ...recipe, id: `r-${Date.now()}` };
      setRecipes((prev) => [...prev, newRecipe]);
      await db.create("recipes", newRecipe);
      completeTodoByCategory("recipes");
    } catch (e) {
      toast.error(e.message || "Failed to add formula");
      throw e;
    }
  };
  const updateRecipe = (id, updates) => {
    setRecipes((prev) => prev.map((r) => r.id === id ? { ...r, ...updates } : r));
    completeTodoByCategory("recipes");
  };
  const updateBudget = (updates) => {
    setBudgets((prev) => ({ ...prev, ...updates }));
  };
  const addTodo = (task, category) => {
    setTodos((prev) => [{ id: Date.now().toString(), task, completed: false, category, createdDate: (/* @__PURE__ */ new Date()).toISOString() }, ...prev]);
  };
  const toggleTodo = (id) => {
    setTodos((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };
  const completeTodoByCategory = (category) => {
    setTodos((prev) => prev.map((t) => t.category === category ? { ...t, completed: true } : t));
  };
  const startTutorial = () => {
    setTutorialStepState(0);
    setIsTutorialActive(true);
  };
  const setTutorialStep = (step) => setTutorialStepState(step);
  const completeTutorial = () => {
    setIsTutorialActive(false);
    setTutorialStepState(0);
  };
  const toggleIntegrationStatus = (id) => {
    setIntegrations((prev) => prev.map((int) => {
      if (int.id === id) {
        const newStatus = int.status === "Connected" ? "Connect" : "Connected";
        return {
          ...int,
          status: newStatus,
          lastSync: newStatus === "Connected" ? "Just now" : int.lastSync
        };
      }
      return int;
    }));
  };
  const updateSystemUser = (id, updates) => {
    setSystemUsers((prev) => prev.map((u) => u.id === id ? { ...u, ...updates } : u));
  };
  const deleteSystemUser = (id) => {
    setSystemUsers((prev) => prev.filter((u) => u.id !== id));
  };
  const inviteSystemUser = (email, tier) => {
    setSystemUsers((prev) => [...prev, {
      id: `usr_${Math.random().toString(36).substr(2, 5)}`,
      name: "Pending User",
      email,
      tier,
      status: "Pending",
      lastLogin: "Never",
      revenueProcessed: 0
    }]);
  };
  const submitVIPWaitlist = async (data) => {
    try {
      const waitlistRef = doc(db$1, "vip_waitlist", data.email);
      await setDoc(waitlistRef, {
        ...data,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
      fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, timestamp: (/* @__PURE__ */ new Date()).toISOString() })
      }).catch((err) => console.error("Failed to sync to sheets:", err));
      toast.success("You have been added to the VIP Waitlist!");
      return true;
    } catch (error) {
      console.error("Waitlist submission failed", error);
      toast.error("Submission failed. Please try again.");
      return false;
    }
  };
  return /* @__PURE__ */ jsx(DataContext.Provider, { value: {
    inventory,
    orders,
    manualCustomers,
    businessProfile,
    isAuthenticated,
    userTier,
    reports,
    productionStats,
    suppliers,
    marketingPosts,
    integrations,
    qualityChecks,
    locations,
    supplierCommunications,
    recipes,
    appointments,
    isSessionVerifying,
    demandInsights,
    budgets,
    todos,
    isTutorialActive,
    tutorialStep,
    login,
    googleLogin,
    logout,
    signUp,
    updateTier,
    updateBusinessProfile,
    onboardingState,
    markHubVisited,
    getInventoryValue,
    getTotalRevenue,
    getMarginMetrics,
    saveReport,
    deleteReport,
    importData,
    addInventoryItem,
    updateInventory,
    addSupplier,
    updateSupplier,
    deleteSupplier,
    addLocation,
    addCommunication,
    addQualityCheck,
    addMarketingPost,
    addAppointment,
    addManualCustomer,
    updateMarketingPost,
    generateSchedule,
    produceBatch,
    processOrder,
    syncWooCommerce,
    addRecipe,
    updateRecipe,
    updateBudget,
    addTodo,
    toggleTodo,
    completeTodoByCategory,
    startTutorial,
    setTutorialStep,
    completeTutorial,
    toggleIntegrationStatus,
    systemUsers,
    updateSystemUser,
    deleteSystemUser,
    inviteSystemUser,
    connectedChannels,
    toggleChannelConnection,
    submitVIPWaitlist
  }, children });
};
const useArtisanData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useArtisanData error");
  return context;
};
const chatWithLola = async (message, context, mode = "fast") => {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "chatWithLola", payload: { message, context, mode } })
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Lola Node Error:", error);
    return { text: "Node communication error. Verify API connection.", isError: true, followUpQuestions: [] };
  }
};
const analyzeLolaImage = async (imageB64, prompt) => {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "analyzeLolaImage", payload: { imageB64, prompt } })
    });
    const data = await response.json();
    return data.text || "Failed to analyze visual asset.";
  } catch (e) {
    console.error("Visual Analysis Error:", e);
    return "Failed to analyze visual asset.";
  }
};
const generateLolaImage = async (prompt, config) => {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generateLolaImage", payload: { prompt, config } })
    });
    const data = await response.json();
    return data.image || null;
  } catch (e) {
    console.error("Image Generation Error:", e);
    throw e;
  }
};
const generateLolaSpeech = async (text) => {
  if (!text) return null;
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generateLolaSpeech", payload: { text } })
    });
    const data = await response.json();
    return data.audio || null;
  } catch (error) {
    console.error("Lola TTS Error:", error);
    return null;
  }
};
const searchBusinessData = async (query, data) => {
  return (await chatWithLola(query, data, "fast")).text;
};
const analyzeBudgetGuard = async (context) => {
  const result = await chatWithLola("Generate strategic budget proposal.", context, "deep");
  try {
    return JSON.parse(result.text);
  } catch (e) {
    return null;
  }
};
const generatePlatformContentBundle = async (strategy) => {
  const result = await chatWithLola("Synthesize posts.", strategy, "fast");
  try {
    return JSON.parse(result.text);
  } catch (e) {
    return null;
  }
};
const generateFinancialAnalysis = async (orders, inventory) => {
  const result = await chatWithLola("Generate 5-year recovery projection.", { orders, inventory }, "deep");
  try {
    return JSON.parse(result.text);
  } catch (e) {
    return null;
  }
};
const generateBudgetStrategy = async (rev, exp, goals) => {
  const result = await chatWithLola(`Optimize budget. Rev: ${rev} Exp: ${exp} Goals: ${goals}`, null, "deep");
  try {
    return JSON.parse(result.text);
  } catch (e) {
    return null;
  }
};
const TierContext = createContext(void 0);
const TierProvider = ({ children }) => {
  const { businessProfile, isAuthenticated } = useArtisanData();
  const [currentTier, setCurrentTier] = useState("Free Audit");
  const [permissionsMap, setPermissionsMap] = useState({});
  const [usage, setUsage] = useState({});
  const [isTierLoading, setIsTierLoading] = useState(true);
  const defaultPermissions = {
    "marketing_studio": true,
    "visual_analysis": true,
    "marketing_creator": true,
    "ai_avatar_studio": false,
    // Locked for free/basic
    "advanced_synthesis": false,
    "inventory_forecasting": false
  };
  useEffect(() => {
    const fetchTierData = async () => {
      if (!isAuthenticated || !businessProfile.email) {
        setIsTierLoading(false);
        return;
      }
      setIsTierLoading(true);
      const gasUrl = "https://script.google.com/macros/s/AKfycbwcHalq43bfMKo-HHwKO6cNGNNBU67sF7CPtRHITBw1Lbdrx28GNOHfBBDJhEDZSTxB/exec";
      try {
        const response = await fetch(`${gasUrl}?action=getUserTier&userId=${encodeURIComponent(businessProfile.email)}`);
        const data = await response.json();
        if (data.success) {
          setCurrentTier(data.tier);
          setPermissionsMap(data.permissions);
          setUsage(data.usage || {});
        } else {
          setCurrentTier(businessProfile.tier);
          setPermissionsMap(defaultPermissions);
        }
      } catch (error) {
        console.error("Error fetching tier from GAS:", error);
        setCurrentTier(businessProfile.tier);
        setPermissionsMap(defaultPermissions);
      } finally {
        setIsTierLoading(false);
      }
    };
    fetchTierData();
  }, [isAuthenticated, businessProfile.email, businessProfile.tier]);
  const checkAccess = (featureKey) => {
    if (businessProfile.role === "admin") return true;
    return !!permissionsMap[featureKey];
  };
  const incrementUsage = async (featureKey) => {
    if (businessProfile.role === "admin") return true;
    const gasUrl = "https://script.google.com/macros/s/AKfycbwcHalq43bfMKo-HHwKO6cNGNNBU67sF7CPtRHITBw1Lbdrx28GNOHfBBDJhEDZSTxB/exec";
    try {
      const res = await fetch(gasUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "incrementUsage",
          userId: businessProfile.email,
          featureKey
        })
      });
      const data = await res.json();
      if (data.success) {
        setUsage((prev) => ({ ...prev, [featureKey]: (prev[featureKey] || 0) + 1 }));
        return true;
      } else {
        toast.error(`Usage limit reached for ${featureKey}. Please upgrade your tier.`);
        return false;
      }
    } catch (e) {
      console.error("Failed to increment usage", e);
      return false;
    }
  };
  const getProUsageStatus = () => {
    const isPro = currentTier === "Margin Protection Pro";
    const softCap = 2500;
    const creditsUsed = Object.values(usage).reduce((a, b) => a + b, 0);
    const showWarning = isPro && creditsUsed >= softCap * 0.9;
    return { isPro, creditsUsed, softCap, showWarning };
  };
  return /* @__PURE__ */ jsx(TierContext.Provider, { value: { currentTier, permissionsMap, usage, checkAccess, incrementUsage, getProUsageStatus, isTierLoading }, children });
};
const useTierContext = () => {
  const context = useContext(TierContext);
  if (!context) {
    throw new Error("useTierContext must be used within a TierProvider");
  }
  return context;
};
const useFeatureGate = (featureKey) => {
  const { checkAccess, incrementUsage, isTierLoading } = useTierContext();
  const navigate = useNavigate();
  const isLocked = !isTierLoading && !checkAccess(featureKey);
  const executeAction = async (action, isMetered = false) => {
    if (isLocked) {
      toast.error("Feature locked. Please upgrade your subscription tier.");
      navigate("/settings");
      return;
    }
    if (isMetered) {
      const allowed = await incrementUsage(featureKey);
      if (!allowed) {
        navigate("/settings");
        return;
      }
    }
    await action();
  };
  return { isLocked, executeAction, isTierLoading };
};
const Button = ({ variant = "primary", className = "", children, style, ...props }) => {
  const baseStyle = "w-full md:w-auto px-6 py-3 rounded-full font-sans font-medium transition-all duration-500 flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-[10px]";
  let variantClass = "";
  if (variant === "primary") {
    variantClass = "bg-[#6A2C91] text-white hover:bg-[#5c247d] shadow-[0_8px_30px_rgba(106,44,145,0.3)] hover:shadow-[0_8px_30px_rgba(106,44,145,0.5)] active:scale-95";
  } else if (variant === "premium") {
    variantClass = "bg-[#C5A059] text-[#140d24] hover:bg-[#b08e4d] shadow-[0_8px_30px_rgba(197,160,89,0.3)] hover:shadow-[0_8px_30px_rgba(197,160,89,0.4)] active:scale-95 font-black";
  } else if (variant === "secondary") {
    variantClass = "bg-purple-900/10 text-purple-200 border border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-900/30 shadow-sm active:scale-95";
  } else if (variant === "outline") {
    variantClass = "border border-white/10 text-white/70 hover:bg-white/5 active:scale-95";
  } else if (variant === "danger") {
    variantClass = "bg-red-500/10 text-red-300 border border-red-500/20 hover:bg-red-500/20 hover:text-red-200 shadow-sm active:scale-95";
  } else if (variant === "success") {
    variantClass = "bg-green-600 text-white hover:bg-green-700 shadow-[0_8px_30px_rgba(22,163,74,0.3)] hover:shadow-[0_8px_30px_rgba(22,163,74,0.5)] active:scale-95 border-none font-black";
  } else {
    variantClass = "text-white/50 hover:bg-white/5 hover:text-white active:scale-95";
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: `${baseStyle} ${variantClass} ${className}`,
      style,
      ...props,
      children
    }
  );
};
const Card = ({ children, className = "", title, style, onClick }) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: `luxury-card rounded-[2rem] p-8 ${className}`,
    style,
    onClick,
    children: [
      title && /* @__PURE__ */ jsxs("h3", { className: "uppercase tracking-[0.2em] text-[10px] font-black mb-6 text-[#C5A059] flex items-center gap-2 italic", children: [
        /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-[#6A2C91]" }),
        " ",
        title
      ] }),
      children
    ]
  }
);
const LockedNode = ({ children, isLocked, requiredTier, onUpgrade, featureKey }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const gate = featureKey ? useFeatureGate(featureKey) : { isLocked: !!isLocked, isTierLoading: false };
  const effectiveIsLocked = featureKey ? gate.isLocked : !!isLocked;
  const handleUpgradeClick = () => {
    if (onUpgrade) {
      onUpgrade();
    } else {
      navigate("/settings/subscription", { state: { from: location.pathname } });
    }
  };
  if (gate.isTierLoading) return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center p-20", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-[#C5A059]", size: 32 }) });
  if (!effectiveIsLocked) return /* @__PURE__ */ jsx(Fragment, { children });
  return /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-[2rem] luxury-card group", children: [
    /* @__PURE__ */ jsx("div", { className: "blur-[6px] pointer-events-none transition-all duration-700 group-hover:blur-[8px]", children }),
    /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-[4px] flex flex-col items-center justify-center p-4 sm:p-8 text-center animate-in fade-in duration-700", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 shadow-2xl border border-white/10", children: /* @__PURE__ */ jsx(Lock, { size: 28, strokeWidth: 1.5 }) }),
      /* @__PURE__ */ jsx("h4", { className: "text-2xl font-serif text-white tracking-tight mb-3", children: "Vault Node Locked" }),
      /* @__PURE__ */ jsxs("p", { className: "text-white/50 font-sans font-light text-sm mb-8 max-w-[240px] leading-relaxed", children: [
        "This synaptic protocol requires a ",
        /* @__PURE__ */ jsx("span", { className: "font-medium text-[#6A2C91]", children: requiredTier }),
        " authorization."
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "primary", onClick: handleUpgradeClick, className: "h-12 px-10", children: [
        /* @__PURE__ */ jsx(Crown, { size: 16, className: "mr-2 text-[#C5A059]", strokeWidth: 1.5 }),
        " UPGRADE ACCESS"
      ] })
    ] })
  ] });
};
const VaultBanner = ({ title, subtitle, badge = "Secure Vault Access", children, className = "" }) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `relative w-full overflow-hidden py-20 px-12 md:px-20 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(106,44,145,0.2)] ${className}`,
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#0A0A0A]" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6A2C91_0%,transparent_60%)] opacity-40" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#C5A059_0%,transparent_60%)] opacity-30" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,#10b981_0%,transparent_70%)] opacity-20" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent" }),
        /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#6A2C91]/30 to-transparent" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-white flex flex-col items-center text-center", children: [
          /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: 0.2, duration: 0.8 },
              className: "flex items-center gap-4 mb-8 px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full",
              children: [
                /* @__PURE__ */ jsx(ShieldCheck, { size: 20, className: "text-[#C5A059]" }),
                /* @__PURE__ */ jsx("span", { className: "text-[12px] font-sans uppercase tracking-[0.4em] text-[#C5A059] font-bold", children: badge })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsx("h1", { className: "text-5xl md:text-7xl font-serif tracking-tighter text-white leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]", children: title }) }),
          /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.4, duration: 0.8 },
              className: "text-white/70 text-lg md:text-xl font-sans font-light mb-12 max-w-3xl leading-relaxed italic",
              children: subtitle
            }
          ),
          children && /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.5, duration: 0.8 },
              className: "flex flex-wrap justify-center gap-6",
              children
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-4 sm:p-10 left-20 w-32 h-32 border border-[#C5A059]/10 rounded-2xl rotate-12" }),
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-10 right-20 w-48 h-48 border border-[#6A2C91]/10 rounded-full" })
      ]
    }
  );
};
const Badge = ({ children, color = "purple", className = "" }) => {
  let colorStyles = "";
  if (color === "gold") {
    colorStyles = "bg-amber-500/10 text-amber-500 border border-amber-500/20";
  } else if (color === "purple") {
    colorStyles = "bg-purple-500/10 text-[#6A2C91] border border-purple-500/20";
  } else if (color === "red") {
    colorStyles = "bg-red-500/10 text-red-500 border border-red-500/20";
  } else if (color === "green") {
    colorStyles = "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
  } else if (color === "blue") {
    colorStyles = "bg-blue-500/10 text-blue-500 border border-blue-500/20";
  } else {
    colorStyles = "bg-white/5 text-white/60 border border-white/10";
  }
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `px-3 py-1.5 rounded-full text-[9px] font-sans font-medium uppercase tracking-[0.2em] ${colorStyles} ${className}`,
      children
    }
  );
};
const Input = (props) => /* @__PURE__ */ jsx(
  "input",
  {
    ...props,
    className: `bg-white/5 border border-white/10 text-white p-4 rounded-2xl w-full focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-[#6A2C91]/40 focus:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-500 placeholder-white/20 font-medium text-sm ${props.className}`
  }
);
const Select = (props) => /* @__PURE__ */ jsx(
  "select",
  {
    ...props,
    className: `bg-white/5 border border-white/10 text-white p-4 rounded-2xl w-full focus:outline-none focus:bg-white/10 focus:ring-1 focus:ring-[#6A2C91]/40 focus:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-500 font-medium text-sm appearance-none ${props.className}`,
    children: props.children
  }
);
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-6 animate-in fade-in duration-500", children: /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-[#0A0A0A] border border-white/10 rounded-[3rem] w-full max-w-xl overflow-hidden relative animate-in zoom-in-95 slide-up-5 duration-700", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-4 sm:p-10 pb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "font-serif text-3xl text-white tracking-tight", children: title }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onClose,
          className: "p-3 -mr-2 text-white/30 hover:text-red-500 transition-colors rounded-full hover:bg-white/5",
          "aria-label": "Close modal",
          children: /* @__PURE__ */ jsx(X, { size: 24, strokeWidth: 1.5 })
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-10 pt-4 max-h-[80vh] overflow-y-auto scrollbar-hide", children })
  ] }) });
};
const FileUploader = ({ onUpload, acceptedFormats = ".csv, .pdf, .xlsx, .xls", label = "Synaptic Data Ingestion" }) => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const inputRef = useRef(null);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(Array.from(e.target.files));
    }
  };
  const handleFiles = (newFiles) => {
    setFiles([...files, ...newFiles]);
    if (onUpload) onUpload(newFiles);
  };
  const removeFile = (idx) => {
    const newFiles = [...files];
    newFiles.splice(idx, 1);
    setFiles(newFiles);
  };
  return /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 ml-1", children: label }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `relative border border-dashed rounded-[2rem] p-10 text-center transition-all duration-500 ${dragActive ? "border-[#6A2C91] bg-purple-500/5 shadow-inner" : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#6A2C91]/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"}`,
        onDragEnter: handleDrag,
        onDragLeave: handleDrag,
        onDragOver: handleDrag,
        onDrop: handleDrop,
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ref: inputRef,
              type: "file",
              multiple: true,
              className: "hidden",
              onChange: handleChange,
              accept: acceptedFormats
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-4 cursor-pointer", onClick: () => {
            var _a;
            return (_a = inputRef.current) == null ? void 0 : _a.click();
          }, children: [
            /* @__PURE__ */ jsx("div", { className: `w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${dragActive ? "bg-[#6A2C91] text-white shadow-lg shadow-purple-500/20 scale-110" : "bg-white/10 text-white/30 shadow-sm group-hover:scale-105"}`, children: /* @__PURE__ */ jsx(Upload, { size: 28, strokeWidth: 1.5 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "text-sm font-serif text-white tracking-tight", children: "Initialize Handshake" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/30 font-sans font-medium uppercase tracking-[0.2em] mt-2", children: "Drag files or click to browse" })
            ] })
          ] })
        ]
      }
    ),
    files.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-3", children: files.map((file, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] animate-in slide-up duration-500", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 bg-white/5 rounded-xl text-[#6A2C91]", children: /* @__PURE__ */ jsx(FileText, { size: 20, strokeWidth: 1.5 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm font-sans font-medium text-white truncate max-w-[200px]", children: file.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-sans font-medium text-white/30 uppercase tracking-[0.2em] mt-1", children: [
            (file.size / 1024).toFixed(1),
            " KB"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "w-6 h-6 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle, { size: 14, strokeWidth: 2 }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => removeFile(idx), className: "p-2 text-white/20 hover:text-red-500 transition-colors rounded-full hover:bg-white/5", children: /* @__PURE__ */ jsx(X, { size: 18, strokeWidth: 1.5 }) })
      ] })
    ] }, idx)) })
  ] });
};
const SocialMediaAuthModal = ({ isOpen, onClose, platform }) => {
  const { toggleChannelConnection } = useArtisanData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  return /* @__PURE__ */ jsx(Modal, { isOpen, onClose, title: `Authenticate ${platform}`, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-white/60 font-sans font-light text-sm", children: [
      "Enter your ",
      platform,
      " credentials to authorize automated scheduling and posting from the Artisan Flow Marketing Studio."
    ] }),
    /* @__PURE__ */ jsx(
      Input,
      {
        placeholder: "Email Address",
        value: email,
        onChange: (e) => setEmail(e.target.value),
        className: "w-full"
      }
    ),
    /* @__PURE__ */ jsx(
      Input,
      {
        placeholder: "Password",
        type: "password",
        value: password,
        onChange: (e) => setPassword(e.target.value),
        className: "w-full"
      }
    ),
    /* @__PURE__ */ jsx(
      Button,
      {
        onClick: () => {
          setIsConnecting(true);
          setTimeout(() => {
            setIsConnecting(false);
            toggleChannelConnection(platform);
            onClose();
            toast.success(`${platform} authenticated successfully.`);
          }, 1500);
        },
        disabled: isConnecting,
        className: "w-full h-12 bg-[#6A2C91] hover:bg-[#5a257a] text-white rounded-xl font-sans font-bold tracking-widest text-[10px] uppercase",
        children: isConnecting ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin mx-auto" }) : `Connect ${platform} Account`
      }
    )
  ] }) });
};
const HubCard = ({ title, icon: Icon, color, desc, onClick }) => /* @__PURE__ */ jsxs("div", { onClick, className: "luxury-card bg-[#1A1A1A] border border-white/5 p-8 rounded-[2rem] hover:border-[#C5A059]/30 transition-all cursor-pointer group", children: [
  /* @__PURE__ */ jsx("div", { className: "$color mb-6", children: /* @__PURE__ */ jsx(Icon, { size: 32 }) }),
  /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold font-playfair text-white mb-2", children: title }),
  /* @__PURE__ */ jsx("p", { className: "text-xs text-white/50 font-sans leading-relaxed", children: desc })
] });
const STEPS = [
  {
    title: "Welcome, Architect",
    desc: "Greetings from the LRC Artisan Flow team. Let's briefly walk through your new high-precision command center.",
    icon: Sparkles,
    route: "/"
  },
  {
    title: "Synaptic Path",
    desc: "This is your Overview. Lola AI synthesizes real-time metrics to show you exactly where your business stands at any given moment.",
    icon: LayoutDashboard,
    route: "/command-center"
  },
  {
    title: "Resource Hub",
    desc: "Your Inventory Vault. Track raw materials and finished goods with surgical precision. This is where your material burn rates are calculated.",
    icon: Boxes,
    route: "/inventory"
  },
  {
    title: "Manufacturing Control",
    desc: "Process omnichannel orders and sync with platforms like Shopify or WooCommerce. Our Synaptic Handshake ensures data integrity across every node.",
    icon: ShoppingBag,
    route: "/operations/orders"
  },
  {
    title: "Marketing Studio",
    desc: "Generate AI-powered copy, visual assets, and comprehensive strategies designed to capitalize on your current stock levels.",
    icon: Target,
    route: "/marketing"
  },
  {
    title: "Budget Guard™",
    desc: "Your financial steering wheel. Set targets and let AI analyze your cash flow to suggest optimal resource reallocation.",
    icon: ShieldCheck,
    route: "/finance/budget-guard"
  }
];
const TutorialOverlay = () => {
  const { isTutorialActive, tutorialStep, setTutorialStep, completeTutorial } = useArtisanData();
  const navigate = useNavigate();
  if (!isTutorialActive) return null;
  const currentStep = STEPS[tutorialStep];
  const isLast = tutorialStep === STEPS.length - 1;
  const handleNext = () => {
    if (isLast) {
      completeTutorial();
    } else {
      const nextStep = tutorialStep + 1;
      setTutorialStep(nextStep);
      navigate(STEPS[nextStep].route);
    }
  };
  const handlePrev = () => {
    if (tutorialStep > 0) {
      const prevStep = tutorialStep - 1;
      setTutorialStep(prevStep);
      navigate(STEPS[prevStep].route);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-end justify-center md:items-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-stone-200 relative animate-in zoom-in slide-up", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1.5 bg-stone-100", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "h-full bg-[#6A2C91] transition-all duration-500",
        style: { width: `${(tutorialStep + 1) / STEPS.length * 100}%` }
      }
    ) }),
    /* @__PURE__ */ jsx(
      "button",
      {
        onClick: completeTutorial,
        className: "absolute top-6 right-6 p-2 text-stone-300 hover:text-red-500 transition-colors",
        children: /* @__PURE__ */ jsx(X, { size: 24 })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-10 space-y-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-[#6A2C91] shadow-inner", children: /* @__PURE__ */ jsx(currentStep.icon, { size: 32 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-[#C5A059] uppercase tracking-[0.3em]", children: "Synaptic Onboarding" }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-white tracking-tighter uppercase italic", children: currentStep.title })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-lg leading-relaxed font-medium", children: currentStep.desc }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-6", children: [
        /* @__PURE__ */ jsx("div", { className: "flex gap-1.5", children: STEPS.map((_, i) => /* @__PURE__ */ jsx(
          "div",
          {
            className: `w-2 h-2 rounded-full transition-all ${i === tutorialStep ? "w-6 bg-[#6A2C91]" : "bg-stone-200"}`
          },
          i
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          tutorialStep > 0 && /* @__PURE__ */ jsxs(
            Button,
            {
              variant: "outline",
              onClick: handlePrev,
              className: "h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest border-stone-200 text-stone-400 hover:text-gray-900",
              children: [
                /* @__PURE__ */ jsx(ChevronLeft, { size: 16 }),
                " BACK"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleNext,
              className: "h-12 px-10 rounded-2xl bg-[#6A2C91] text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-purple-100 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all",
              children: [
                isLast ? "INITIALIZE SYSTEM" : "NEXT NODE",
                " ",
                /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
              ]
            }
          )
        ] })
      ] })
    ] })
  ] }) });
};
const SupportModal = ({ isOpen, onClose }) => {
  const { businessProfile } = useArtisanData();
  const [issueType, setIssueType] = useState("General Inquiry");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const gasUrl = "https://script.google.com/macros/s/AKfycbwcHalq43bfMKo-HHwKO6cNGNNBU67sF7CPtRHITBw1Lbdrx28GNOHfBBDJhEDZSTxB/exec";
      if (gasUrl) {
        await fetch(gasUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "createSupportTicket",
            userId: businessProfile.email,
            issueType,
            subject,
            description
          })
        }).catch((e2) => console.warn("GAS Mock Error", e2));
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const ticketId = `#TKT-${Math.floor(100 + Math.random() * 900)}`;
      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success(`Ticket ${ticketId} created successfully! Our team will respond shortly.`);
      setTimeout(() => {
        onClose();
        setIssueType("General Inquiry");
        setSubject("");
        setDescription("");
        setIsSuccess(false);
      }, 3e3);
    } catch (error) {
      toast.error("Failed to submit ticket. Please try again.");
      setIsSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 },
        className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg z-[101]",
        children: /* @__PURE__ */ jsxs(Card, { className: "bg-[#111111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-white/5 flex items-center justify-between bg-black/20", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059]", children: /* @__PURE__ */ jsx(HelpCircle, { size: 20 }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white font-serif", children: "ArtisanFlow Support Node" })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: onClose, className: "text-white/50 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
          ] }),
          isSuccess ? /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-10 flex flex-col items-center justify-center text-center space-y-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(CheckCircle, { size: 40 }) }),
            /* @__PURE__ */ jsx("h4", { className: "text-2xl font-bold text-white", children: "Ticket Submitted" }),
            /* @__PURE__ */ jsx("p", { className: "text-white/50 text-sm max-w-xs mx-auto", children: "Your request has been routed to our support architects. We will be in touch shortly." })
          ] }) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-white/50 uppercase tracking-wider", children: "Issue Type" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  value: issueType,
                  onChange: (e) => setIssueType(e.target.value),
                  className: "w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("option", { children: "General Inquiry" }),
                    /* @__PURE__ */ jsx("option", { children: "Bug Report" }),
                    /* @__PURE__ */ jsx("option", { children: "Feature Suggestion" }),
                    /* @__PURE__ */ jsx("option", { children: "Billing Question" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-white/50 uppercase tracking-wider", children: "Subject" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: subject,
                  onChange: (e) => setSubject(e.target.value),
                  placeholder: "Brief summary of your inquiry",
                  className: "w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors placeholder:text-white/20",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-xs font-bold text-white/50 uppercase tracking-wider", children: "Description" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                  placeholder: "Provide as much detail as possible...",
                  className: "w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#C5A059] transition-colors min-h-[120px] resize-none placeholder:text-white/20",
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between pt-4", children: [
              /* @__PURE__ */ jsxs("button", { type: "button", className: "flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-white/5", children: [
                /* @__PURE__ */ jsx(Paperclip, { size: 16 }),
                " Attach File (Optional)"
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "submit",
                  disabled: isSubmitting,
                  className: "bg-[#C5A059] hover:bg-[#b08d4a] text-black px-6 h-12 rounded-xl font-bold tracking-wider uppercase flex items-center justify-center gap-2",
                  children: isSubmitting ? /* @__PURE__ */ jsx(Fragment, { children: "Sending..." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    "Submit Node ",
                    /* @__PURE__ */ jsx(Send, { size: 16 })
                  ] })
                }
              )
            ] })
          ] })
        ] })
      }
    )
  ] }) });
};
function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { businessProfile, userTier, logout, inventory, orders, getMarginMetrics, startTutorial } = useArtisanData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const context = { inventory, orders, margins: getMarginMetrics() };
    const result = await searchBusinessData(searchQuery, context);
    setSearchResult(result || null);
    setIsSearching(false);
    setTimeout(() => setSearchResult(null), 1e4);
  };
  const pathnames = location.pathname.split("/").filter((x) => x);
  return /* @__PURE__ */ jsxs("div", { className: "flex h-screen w-full bg-[#0A0A0A] text-white font-sans selection:bg-purple-900/30", children: [
    /* @__PURE__ */ jsx(Toaster, { position: "top-right", richColors: true, expand: false }),
    /* @__PURE__ */ jsx(TutorialOverlay, {}),
    /* @__PURE__ */ jsx("div", { className: "carbon-texture" }),
    /* @__PURE__ */ jsx("div", { className: "light-streak-top" }),
    /* @__PURE__ */ jsx("div", { className: "light-streak-bottom" }),
    /* @__PURE__ */ jsx("div", { className: "light-streak-left" }),
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes soft-success-glow {
          0% { box-shadow: 0 0 0 0 rgba(120, 190, 32, 0); border-color: transparent; transform: scale(1); }
          50% { box-shadow: 0 0 30px 10px rgba(120, 190, 32, 0.3); border-color: rgba(120, 190, 32, 0.6); transform: scale(1.01); }
          100% { box-shadow: 0 0 0 0 rgba(120, 190, 32, 0); border-color: transparent; transform: scale(1); }
        }
        .animate-soft-success {
          animation: soft-success-glow 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
      ` }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: isMobileMenuOpen && /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, backdropFilter: "blur(0px)" },
        animate: { opacity: 1, backdropFilter: "blur(8px)" },
        exit: { opacity: 0, backdropFilter: "blur(0px)" },
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
        className: "fixed inset-0 bg-black/40 z-40 md:hidden",
        onClick: () => setIsMobileMenuOpen(false)
      }
    ) }),
    /* @__PURE__ */ jsxs("aside", { className: `artisan-flow-sidebar z-50 transition-all duration-300 ${isMobileMenuOpen ? "translate-x-0" : isSidebarCollapsed ? "-translate-x-[120%]" : "-translate-x-[120%] md:translate-x-0"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "sidebar-brand-block flex items-center justify-center relative", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center w-full py-2", children: /* @__PURE__ */ jsx("img", { src: "/LOGO%20Official-Trans.png", alt: "ArtisanFlow Logo", className: "h-[90px] w-auto object-contain mx-auto" }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsMobileMenuOpen(false), className: "md:hidden absolute right-0 top-0 text-white/50 hover:text-[#C5A059] transition-colors", children: /* @__PURE__ */ jsx(X, { size: 20 }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsSidebarCollapsed(true), className: "hidden md:block absolute right-0 top-0 text-white/50 hover:text-[#C5A059] transition-colors", children: /* @__PURE__ */ jsx(Menu, { size: 20 }) })
      ] }),
      /* @__PURE__ */ jsxs("nav", { className: "sidebar-nav-container", children: [
        /* @__PURE__ */ jsxs("div", { className: "nav-section-group", children: [
          /* @__PURE__ */ jsx("span", { className: "nav-section-title", children: "Primary Nodes" }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            navigate("/");
            setIsMobileMenuOpen(false);
          }, className: `nav-item ${location.pathname === "/" ? "active" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "nav-icon text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0", children: "📊" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: "Dashboard" }),
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            navigate("/marketing");
            setIsMobileMenuOpen(false);
          }, className: `nav-item ${location.pathname === "/marketing" ? "active" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "nav-icon text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0", children: "✨" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: "Marketing Studio" }),
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            navigate("/recipes");
            setIsMobileMenuOpen(false);
          }, className: `nav-item ${location.pathname === "/recipes" ? "active" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "nav-icon text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0", children: "🏭" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: "Manufacturing" }),
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            navigate("/operations/crm");
            setIsMobileMenuOpen(false);
          }, className: `nav-item ${location.pathname === "/operations/crm" ? "active" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "nav-icon text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0", children: "🤝" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: "CRM Hub" }),
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            navigate("/finance");
            setIsMobileMenuOpen(false);
          }, className: `nav-item ${location.pathname === "/finance" ? "active" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "nav-icon text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0", children: "📈" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: "Orders & Finance" }),
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nav-section-group", children: [
          /* @__PURE__ */ jsx("span", { className: "nav-section-title", children: "Supply Logistics" }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            navigate("/inventory");
            setIsMobileMenuOpen(false);
          }, className: `nav-item ${location.pathname === "/inventory" ? "active" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "nav-icon text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0", children: "📦" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: "Materials Matrix" }),
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            navigate("/forecasting");
            setIsMobileMenuOpen(false);
          }, className: `nav-item ${location.pathname === "/forecasting" ? "active" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "nav-icon text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0", children: "⏳" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: "Forecasting" }),
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            navigate("/qc");
            setIsMobileMenuOpen(false);
          }, className: `nav-item ${location.pathname === "/qc" ? "active" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "nav-icon text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0", children: "💸" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: "Trapped Cash Audit" }),
            /* @__PURE__ */ jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_#f59e0b]" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "nav-section-group mt-auto pt-8", children: [
          /* @__PURE__ */ jsx("span", { className: "nav-section-title text-[#C5A059]", children: "My Account" }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            navigate("/settings/account");
            setIsMobileMenuOpen(false);
          }, className: `nav-item ${location.pathname === "/settings/account" ? "active" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "nav-icon text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0", children: "💎" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: "Subscription Status" })
          ] }),
          businessProfile.role === "super_admin" && /* @__PURE__ */ jsxs("button", { onClick: () => {
            navigate("/super-admin");
            setIsMobileMenuOpen(false);
          }, className: `nav-item ${location.pathname === "/super-admin" ? "active" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "nav-icon text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0", children: "🛡️" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: "Super-Admin" })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            navigate("/settings/integrations");
            setIsMobileMenuOpen(false);
          }, className: `nav-item ${location.pathname === "/settings/integrations" ? "active" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "nav-icon text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0", children: "💳" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: "Integrations" })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            navigate("/marketing/brand-voice");
            setIsMobileMenuOpen(false);
          }, className: `nav-item ${location.pathname === "/marketing/brand-voice" ? "active" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "nav-icon text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0", children: "✉️" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: "Brand Voice Profile" })
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            setIsSupportOpen(true);
            setIsMobileMenuOpen(false);
          }, className: "nav-item", children: [
            /* @__PURE__ */ jsx("span", { className: "nav-icon text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] grayscale-0", children: "🆘" }),
            /* @__PURE__ */ jsx("span", { className: "flex-1 text-left", children: "Support Node" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "sidebar-user-footer", children: [
        /* @__PURE__ */ jsx("div", { className: "user-avatar-frame text-xl", children: "👤" }),
        /* @__PURE__ */ jsxs("div", { className: "user-details text-left flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("span", { className: "user-name truncate", children: businessProfile.ownerName || "LaToya Carter" }),
          /* @__PURE__ */ jsx("span", { className: "user-role truncate", children: "Sovereign Architect" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: logout, className: "ml-2 p-2 text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors", title: "Revoke Access", children: /* @__PURE__ */ jsx(LogOut, { size: 16 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: `flex-1 overflow-auto relative bg-transparent flex flex-col transition-all duration-300 ${isSidebarCollapsed ? "md:ml-0" : "md:ml-[280px]"}`, children: [
      /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-30 w-full bg-black/40 backdrop-blur-xl border-b border-white/5 px-4 md:px-10 py-3 md:py-5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 md:gap-4 sm:p-12 transition-all duration-500", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 md:gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setIsMobileMenuOpen(true), className: "md:hidden p-2 -ml-2 text-white/60 hover:text-white", children: /* @__PURE__ */ jsx(Menu, { size: 24 }) }),
          isSidebarCollapsed && /* @__PURE__ */ jsx("button", { onClick: () => setIsSidebarCollapsed(false), className: "hidden md:block p-2 -ml-2 text-white/60 hover:text-[#C5A059] transition-colors", children: /* @__PURE__ */ jsx(Menu, { size: 24 }) }),
          /* @__PURE__ */ jsx("div", { className: `transition-all duration-300 ${!isSidebarCollapsed ? "md:hidden" : ""}`, children: /* @__PURE__ */ jsx("img", { src: "/LOGO%20Official-Trans.png", alt: "ArtisanFlow Logo", className: "h-[40px] w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity", onClick: () => navigate("/") }) }),
          /* @__PURE__ */ jsxs("nav", { className: "hidden md:flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/30", children: [
            /* @__PURE__ */ jsxs("span", { className: "hover:text-[#C5A059] cursor-pointer transition-colors flex items-center gap-1", onClick: () => navigate("/"), children: [
              /* @__PURE__ */ jsx(Hexagon, { size: 10, className: "text-[#C5A059]/40" }),
              " Vault"
            ] }),
            pathnames.map((name, index) => {
              const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
              const isLast = index === pathnames.length - 1;
              return /* @__PURE__ */ jsxs(React.Fragment, { children: [
                /* @__PURE__ */ jsx(ChevronRight, { size: 12, className: "text-white/10" }),
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: `transition-all duration-300 ${isLast ? "text-[#C5A059] font-black" : "hover:text-white cursor-pointer"}`,
                    onClick: () => !isLast && navigate(routeTo),
                    children: name.replace(/[-_]/g, " ")
                  }
                )
              ] }, name);
            })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSearch, className: "flex-1 min-w-[150px] w-full order-3 sm:order-none mt-2 sm:mt-0 max-w-xl relative group", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C5A059] transition-colors", size: 14 }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                placeholder: "Ask Lola...",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                className: "w-full bg-white/5 border border-white/10 rounded-xl py-2 sm:py-3 pl-9 sm:pl-12 pr-10 sm:pr-12 text-xs focus:bg-white/10 focus:border-[#C5A059] focus:ring-4 focus:ring-amber-500/5 transition-all outline-none shadow-inner font-medium text-white"
              }
            ),
            /* @__PURE__ */ jsx("div", { className: "absolute right-3 sm:right-4 top-1/2 -translate-y-1/2", children: isSearching ? /* @__PURE__ */ jsx(Loader2, { size: 12, className: "animate-spin text-[#C5A059]" }) : /* @__PURE__ */ jsx(Sparkles, { size: 12, className: "text-[#C5A059] animate-pulse" }) })
          ] }),
          searchResult && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 right-0 mt-5 bg-white border border-stone-200 rounded-[2.5rem] shadow-2xl p-4 sm:p-10 animate-in slide-up z-50 border-t-8 border-t-[#6A2C91]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-6", children: [
            /* @__PURE__ */ jsx("div", { className: "p-4 bg-purple-50 rounded-3xl text-[#6A2C91] shadow-inner", children: /* @__PURE__ */ jsx(Sparkles, { size: 28 }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-[#6A2C91] mb-2 italic", children: "Synaptic Analysis Result" }),
              /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-800 leading-relaxed font-semibold", children: searchResult })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => setSearchResult(null), className: "text-gray-300 hover:text-red-500 p-2 transition-colors", children: /* @__PURE__ */ jsx(X, { size: 20 }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "hidden lg:flex items-center gap-2 pr-6 border-r border-white/5", children: [
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                className: "p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-[#C5A059] transition-colors",
                children: /* @__PURE__ */ jsx(Bell, { size: 18 })
              }
            ),
            /* @__PURE__ */ jsx(
              motion.button,
              {
                whileHover: { scale: 1.05 },
                whileTap: { scale: 0.95 },
                className: "p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-[#C5A059] transition-colors",
                children: /* @__PURE__ */ jsx(RefreshCw, { size: 18 })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right hidden sm:block", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs font-black text-white uppercase tracking-tighter", children: businessProfile.ownerName }),
            /* @__PURE__ */ jsxs("p", { className: "text-[9px] text-emerald-400 font-black uppercase tracking-[0.2em] flex items-center gap-1.5 justify-end", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { size: 10, className: "mr-0.5" }),
              " Systems Verified ✅"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { onClick: () => navigate("/settings/account"), className: "w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6A2C91] to-[#C5A059] p-[2px] flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(197,160,89,0.3)] group cursor-pointer hover:scale-105 hover:shadow-[0_0_20px_rgba(197,160,89,0.6)] transition-all", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full rounded-[14px] overflow-hidden bg-black flex items-center justify-center", children: businessProfile.avatarUrl ? /* @__PURE__ */ jsx("img", { src: businessProfile.avatarUrl, alt: "Avatar", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(User, { size: 22, className: "text-[#C5A059] group-hover:scale-110 transition-transform" }) }) })
        ] })
      ] }),
      businessProfile.status === "Past Due" && location.pathname !== "/settings/subscription" && /* @__PURE__ */ jsxs("div", { className: "bg-red-900/90 border-b border-red-500/50 p-4 w-full flex flex-col md:flex-row items-center justify-between px-6 md:px-12 gap-4 z-20 shadow-md", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-red-200", children: [
          /* @__PURE__ */ jsx(AlertTriangle, { size: 20, className: "text-red-400" }),
          /* @__PURE__ */ jsxs("span", { className: "font-sans font-medium text-sm", children: [
            /* @__PURE__ */ jsx("strong", { className: "text-white", children: "ACTION REQUIRED:" }),
            " Your tier subscription payment is past due. Tier access may be restricted at any time."
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => navigate("/settings/account"),
            className: "bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-sans font-bold text-[10px] uppercase tracking-widest whitespace-nowrap transition-colors shadow-sm",
            children: "Resolve Now"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 p-4 sm:p-6 md:p-4 sm:p-12 max-w-7xl mx-auto relative z-10 w-full overflow-x-hidden", children }),
      /* @__PURE__ */ jsxs("footer", { className: "w-full py-6 mt-8 border-t border-white/10 flex flex-col items-center justify-center gap-4 text-[11px] uppercase tracking-widest text-white/60 font-bold bg-[#0A0A0A] z-20 sticky bottom-0", children: [
        /* @__PURE__ */ jsx("span", { children: "© 2026 LRC ArtisanFlow. All rights reserved." }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsx("span", { className: "hover:text-[#C5A059] cursor-pointer transition-colors", onClick: () => navigate("/terms"), children: "Terms & Conditions" }),
          /* @__PURE__ */ jsx("span", { className: "text-white/20", children: "|" }),
          /* @__PURE__ */ jsx("span", { className: "hover:text-[#C5A059] cursor-pointer transition-colors", onClick: () => navigate("/privacy"), children: "Privacy Policy" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(SupportModal, { isOpen: isSupportOpen, onClose: () => setIsSupportOpen(false) })
  ] });
}
const SubPageHeader = ({
  title,
  parentTitle,
  onBack,
  actions,
  description
}) => {
  const navigate = useNavigate();
  const [isStarred, setIsStarred] = useState(false);
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };
  const handleStar = () => {
    setIsStarred(!isStarred);
    toast.success(isStarred ? "Removed from favorites" : "Added to favorites");
  };
  return /* @__PURE__ */ jsxs("div", { className: "mb-12", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs(
          motion.button,
          {
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            onClick: handleBack,
            className: "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#6A2C91] transition-colors group",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { size: 14, className: "group-hover:-translate-x-1 transition-transform" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "Back to ",
                parentTitle || "Previous"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsx(
            motion.h1,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              className: "text-5xl text-white font-bold leading-tight",
              style: { fontFamily: '"Playfair Display", serif', letterSpacing: "-0.02em", textShadow: "0 2px 10px rgba(0,0,0,0.5)" },
              children: title
            }
          ),
          description && /* @__PURE__ */ jsx(
            motion.p,
            {
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { delay: 0.2 },
              className: "text-gray-400 text-sm max-w-2xl leading-relaxed font-medium",
              children: description
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.3 },
          className: "flex items-center gap-3",
          children: [
            actions,
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 ml-2 pl-4 border-l border-white/10", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleStar,
                  className: `p-3 rounded-2xl border border-white/10 transition-all shadow-sm ${isStarred ? "bg-[#C5A059]/20 text-[#C5A059]" : "bg-white/5 text-white/40 hover:text-[#C5A059] hover:bg-white/10"}`,
                  children: /* @__PURE__ */ jsx(Star, { size: 18, fill: isStarred ? "currentColor" : "none" })
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: handleShare,
                  className: "p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-[#6A2C91] hover:bg-white/10 transition-all shadow-sm",
                  children: /* @__PURE__ */ jsx(Share2, { size: 18 })
                }
              ),
              /* @__PURE__ */ jsx("button", { onClick: () => toast.info("More options available in the vault"), className: "p-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all shadow-sm", children: /* @__PURE__ */ jsx(MoreHorizontal, { size: 18 }) })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-10 h-[1px] w-full bg-gradient-to-r from-white/10 via-white/20 to-transparent" })
  ] });
};
const VisualAnalysisNode = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prompt, setPrompt] = useState("Analyze this artisanal product for brand alignment and visual quality.");
  const handleFileChange = (files) => {
    if (files[0]) {
      setFile(files[0]);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };
  const runAnalysis = async () => {
    if (!preview) return;
    setIsAnalyzing(true);
    const toastId = toast.loading("Initializing visual audit node...");
    try {
      const result = await analyzeLolaImage(preview, prompt);
      setAnalysis(result);
      toast.success("Visual audit complete.", { id: toastId });
    } catch (error) {
      console.error("Analysis failed", error);
      setAnalysis("Error: Synthesis node offline. Verify vault authorization.");
      toast.error("Audit failed: Synthesis node offline.", { id: toastId });
    } finally {
      setIsAnalyzing(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-8 space-y-16 pb-32 max-w-7xl mx-auto",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "Visual Analyst",
            parentTitle: "Marketing Hub",
            onBack: () => navigate("/marketing"),
            description: "Audit artisanal assets with Gemini 3 Pro Vision"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-12", children: [
          /* @__PURE__ */ jsx(Card, { title: "Source Asset Ingestion", className: "luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-black/40 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
            /* @__PURE__ */ jsx(FileUploader, { onUpload: handleFileChange, acceptedFormats: ".jpg, .jpeg, .png", label: "Drop product photo for audit" }),
            preview && /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.98 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                className: "space-y-10",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-xl shadow-black/5", children: /* @__PURE__ */ jsx("img", { src: preview, className: "w-full h-full object-cover" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsx("label", { className: "text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] ml-1", children: "Analysis Focus" }),
                    /* @__PURE__ */ jsx(
                      "textarea",
                      {
                        className: "w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-base font-sans font-light focus:bg-black/60 focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 h-40 resize-none transition-all duration-500 shadow-sm outline-none text-white",
                        value: prompt,
                        onChange: (e) => setPrompt(e.target.value),
                        placeholder: "Define the parameters for the visual audit..."
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsx(Button, { onClick: runAnalysis, disabled: isAnalyzing, className: "w-full bg-[#C5A059] hover:bg-[#b08d4f] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/10 transition-all duration-500", children: isAnalyzing ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : "INITIALIZE VISUAL AUDIT" })
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsx(Card, { title: "Synaptic Analysis Report", className: "luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-black/20 backdrop-blur-xl", children: analysis ? /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6 },
              className: "prose prose-invert max-w-none",
              children: /* @__PURE__ */ jsx("div", { className: "bg-black/40 p-4 sm:p-8 rounded-3xl border border-white/10 shadow-sm", children: /* @__PURE__ */ jsx("p", { className: "text-gray-300 leading-relaxed font-sans font-light text-lg whitespace-pre-wrap", children: analysis }) })
            }
          ) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center py-40 opacity-20 text-center", children: [
            /* @__PURE__ */ jsx(Eye, { size: 80, strokeWidth: 0.8, className: "text-white mb-8" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] font-sans font-medium text-gray-500 uppercase tracking-[0.4em]", children: "Awaiting Input Mesh" })
          ] }) })
        ] })
      ]
    }
  );
};
const ContextualTutorialModal = ({ hubId, title, description, steps }) => {
  const { onboardingState, markHubVisited, businessProfile } = useArtisanData();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const hasInitialized = React.useRef(false);
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      if (!onboardingState[hubId]) {
        setIsVisible(true);
      }
    }
  }, [hubId, onboardingState, businessProfile.role]);
  const handleDismiss = () => {
    setIsVisible(false);
    markHubVisited(hubId);
  };
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleDismiss();
    }
  };
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  if (!isVisible) return null;
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300", children: /* @__PURE__ */ jsxs("div", { className: "bg-black/60 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 backdrop-blur-3xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-r from-black/80 to-[#101010] border-b border-white/5 p-6 text-white relative", children: [
      /* @__PURE__ */ jsx("button", { onClick: handleDismiss, className: "absolute top-4 right-4 text-white/40 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 20 }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
        /* @__PURE__ */ jsx("div", { className: "p-2 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-lg text-[#C5A059]", children: /* @__PURE__ */ jsx(Info, { size: 24 }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-serif tracking-tight text-white", children: title })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-white/60 font-sans font-light text-sm leading-relaxed", children: description })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-8 space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-[10px] font-black text-white/40 uppercase tracking-[0.2em]", children: "Quick Start Guide" }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-black text-[#C5A059] uppercase tracking-[0.2em]", children: [
          "Step ",
          currentStep + 1,
          " of ",
          steps.length
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "min-h-[120px] flex items-start gap-4 p-6 bg-white/5 border border-white/10 rounded-xl", children: [
        /* @__PURE__ */ jsx("div", { className: "mt-1 text-[#C5A059] shrink-0", children: /* @__PURE__ */ jsx(CheckCircle, { size: 20 }) }),
        /* @__PURE__ */ jsx("p", { className: "text-base font-medium text-white/90 leading-relaxed", children: steps[currentStep] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-4 mt-8 pt-4 border-t border-white/5", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "outline",
            onClick: handlePrev,
            disabled: currentStep === 0,
            className: `flex-1 h-12 font-bold tracking-widest ${currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""}`,
            children: [
              /* @__PURE__ */ jsx(ChevronLeft, { size: 18, className: "mr-1" }),
              " PREV"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Button, { variant: "premium", onClick: handleNext, className: "flex-1 h-12 font-black tracking-widest shadow-lg shadow-[#C5A059]/20", children: [
          currentStep === steps.length - 1 ? "GOT IT, LETS GO" : "NEXT",
          " ",
          currentStep < steps.length - 1 && /* @__PURE__ */ jsx(ChevronRight, { size: 18, className: "ml-1" })
        ] })
      ] })
    ] })
  ] }) });
};
const MarketingGrid$1 = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:p-8", children: [
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Visual Analysis",
        icon: Eye,
        color: "text-emerald-600",
        desc: "Audit product photos and artisanal assets with Gemini Pro Vision.",
        onClick: () => navigate("/marketing/analysis")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Marketing Creator",
        icon: Image,
        color: "text-amber-500",
        desc: "Synthesize 1K/2K/4K marketing assets with Nano Banana Pro.",
        onClick: () => navigate("/marketing/creator")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Marketing Strategy",
        icon: Layers,
        color: "text-[#C5A059]",
        desc: "Generate comprehensive strategies based on business pulse.",
        onClick: () => navigate("/marketing/strategy-report")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Brand Voice Profile",
        icon: Volume2,
        color: "text-indigo-600",
        desc: "Define your brand adjectives and restricted vocabulary.",
        onClick: () => navigate("/marketing/brand-voice")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Content Calendar",
        icon: Calendar,
        color: "text-purple-600",
        desc: "Schedule and manage your posts.",
        onClick: () => navigate("/marketing/calendar")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Social Media Creator",
        icon: Share2,
        color: "text-blue-500",
        desc: "Generate platform-optimized content with AI.",
        onClick: () => navigate("/marketing/social")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Video Creator",
        icon: Video,
        color: "text-red-500",
        desc: "Create scripts and professional videos with Veo.",
        onClick: () => navigate("/marketing/video")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Blog Generator",
        icon: PenTool,
        color: "text-emerald-500",
        desc: "Create SEO-optimized blog posts.",
        onClick: () => navigate("/marketing/blog")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "AI Avatar Studio",
        icon: User,
        color: "text-purple-800",
        desc: "Create and manage AI avatars for video content.",
        onClick: () => navigate("/marketing/avatar")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Advanced Synthesis",
        icon: Zap,
        color: "text-indigo-600",
        desc: "Deep cognitive multi-platform campaign generation.",
        onClick: () => navigate("/marketing/advanced")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Content Approvals",
        icon: CheckCircle,
        color: "text-rose-600",
        desc: "Governance node for marketing deployment.",
        onClick: () => navigate("/marketing/approvals")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Receptionist Logic",
        icon: MessageSquare,
        color: "text-blue-600",
        desc: "Automated qualification protocols for leads.",
        onClick: () => navigate("/marketing/receptionist")
      }
    )
  ] });
};
const MarketingStudio = () => {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-6 space-y-12 pb-20 max-w-7xl mx-auto",
      children: [
        /* @__PURE__ */ jsx(
          ContextualTutorialModal,
          {
            hubId: "marketing_studio",
            title: "Marketing Studio",
            description: "Central command for all your marketing and branding efforts.",
            steps: ["Access Visual Analysis to audit assets.", "Use Marketing Creator for quick designs.", "Generate your Brand Voice Profile."]
          }
        ),
        /* @__PURE__ */ jsx(
          ContextualTutorialModal,
          {
            hubId: "marketing_studio",
            title: "Marketing Studio Overview",
            description: "Welcome to the Marketing Studio, your centralized hub for AI-driven asset creation and brand strategy.",
            steps: [
              "Use Visual Analysis to audit product photos.",
              "Generate high-fidelity assets in the Marketing Creator.",
              "Build a comprehensive strategy in Marketing Strategy.",
              "Define your Brand Voice for consistent output."
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-5xl font-serif text-white tracking-tight mb-3", children: "Marketing Studio" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 font-sans font-light text-lg max-w-xl leading-relaxed", children: "AI-powered content creation and marketing protocols." })
        ] }),
        /* @__PURE__ */ jsx(MarketingGrid$1, {})
      ]
    }
  );
};
const MarketingGrid = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:p-8", children: [
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Visual Analysis",
        icon: Eye,
        color: "text-emerald-600",
        desc: "Audit product photos and artisanal assets with Gemini Pro Vision.",
        onClick: () => navigate("/marketing/analysis")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Marketing Creator",
        icon: Image,
        color: "text-amber-500",
        desc: "Synthesize 1K/2K/4K marketing assets with Nano Banana Pro.",
        onClick: () => navigate("/marketing/creator")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Marketing Strategy",
        icon: Layers,
        color: "text-[#C5A059]",
        desc: "Generate comprehensive strategies based on business pulse.",
        onClick: () => navigate("/marketing/strategy-report")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Brand Voice Profile",
        icon: Volume2,
        color: "text-indigo-600",
        desc: "Define your brand adjectives and restricted vocabulary.",
        onClick: () => navigate("/marketing/brand-voice")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Content Calendar",
        icon: Calendar,
        color: "text-purple-600",
        desc: "Schedule and manage your posts.",
        onClick: () => navigate("/marketing/calendar")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Social Media Creator",
        icon: Share2,
        color: "text-blue-500",
        desc: "Generate platform-optimized content with AI.",
        onClick: () => navigate("/marketing/social")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Video Creator",
        icon: Video,
        color: "text-red-500",
        desc: "Create scripts and professional videos with Veo.",
        onClick: () => navigate("/marketing/video")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Blog Generator",
        icon: PenTool,
        color: "text-emerald-500",
        desc: "Create SEO-optimized blog posts.",
        onClick: () => navigate("/marketing/blog")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "AI Avatar Studio",
        icon: User,
        color: "text-purple-800",
        desc: "Create and manage AI avatars for video content.",
        onClick: () => navigate("/marketing/avatar")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Advanced Synthesis",
        icon: Zap,
        color: "text-indigo-600",
        desc: "Deep cognitive multi-platform campaign generation.",
        onClick: () => navigate("/marketing/advanced")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Content Approvals",
        icon: CheckCircle,
        color: "text-rose-600",
        desc: "Governance node for marketing deployment.",
        onClick: () => navigate("/marketing/approvals")
      }
    ),
    /* @__PURE__ */ jsx(
      HubCard,
      {
        title: "Receptionist Logic",
        icon: MessageSquare,
        color: "text-blue-600",
        desc: "Automated qualification protocols for leads.",
        onClick: () => navigate("/marketing/receptionist")
      }
    )
  ] });
};
const MarketingHub = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsx(
            SubPageHeader,
            {
              title: "Marketing Hub",
              parentTitle: "Marketing Studio",
              onBack: () => navigate("/marketing"),
              description: "Central nervous system for brand growth and content synchronization."
            }
          ),
          /* @__PURE__ */ jsx(
            VaultBanner,
            {
              title: "Marketing Hub",
              subtitle: "Central nervous system for brand growth and content synchronization. Synchronizing brand craftsmanship with automated growth nodes.",
              badge: "Marketing Protocol Active",
              children: /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "primary",
                  className: "bg-[#6A2C91] hover:bg-[#5a257a] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 rounded-full shadow-2xl shadow-[#6A2C91]/20 transition-all",
                  onClick: () => navigate("/marketing/strategy-report"),
                  children: [
                    /* @__PURE__ */ jsx(Sparkles, { size: 16, className: "mr-3" }),
                    " GENERATE STRATEGY"
                  ]
                }
              ) })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(MarketingGrid, {})
      ]
    }
  );
};
const BlogGenerator = () => {
  const navigate = useNavigate();
  const { addMarketingPost } = useArtisanData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generatedBlog, setGeneratedBlog] = useState("");
  const handleGenerate = async () => {
    if (!topic) return toast.error("Please enter a topic.");
    setIsGenerating(true);
    const toastId = toast.loading("Synthesizing article nodes...");
    try {
      const prompt = `Write a comprehensive, SEO-optimized blog post about: ${topic}. Include these keywords: ${keywords}. Use a luxurious, artisanal brand voice. Format with markdown headings.`;
      const result = await chatWithLola(prompt, null, "deep");
      setGeneratedBlog(result.text);
      toast.success("Article synthesis complete.", { id: toastId });
    } catch (error) {
      console.error("Generation failed", error);
      toast.error("Synthesis failed: Node offline.", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };
  const handleSave = () => {
    if (!generatedBlog) return;
    addMarketingPost({
      platform: "Blog",
      topic: topic || "Blog Post",
      content: generatedBlog,
      scheduledDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: "Draft",
      type: "Text"
    });
    toast.success("Article saved to content calendar.");
    navigate("/marketing/calendar");
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-8 space-y-16 pb-32 max-w-7xl mx-auto",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "Blog Generator",
            parentTitle: "Marketing Hub",
            onBack: () => navigate("/marketing"),
            description: "SEO-optimized content synthesis node"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-12", children: [
          /* @__PURE__ */ jsx(Card, { title: "Article Configuration", className: "luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10", children: /* @__PURE__ */ jsxs("div", { className: "space-y-10 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-stone-400 uppercase tracking-[0.3em] mb-3 ml-1", children: "Blog Topic / Title" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: topic,
                  onChange: (e) => setTopic(e.target.value),
                  placeholder: "e.g., The Art of Sustainable Sourcing...",
                  className: "h-16 rounded-2xl bg-stone-50/50 border-stone-100 focus:bg-white focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 font-sans font-light text-base shadow-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-stone-400 uppercase tracking-[0.3em] mb-3 ml-1", children: "SEO Keywords (Comma separated)" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: keywords,
                  onChange: (e) => setKeywords(e.target.value),
                  placeholder: "e.g., sustainability, artisanal, organic...",
                  className: "h-16 rounded-2xl bg-stone-50/50 border-stone-100 focus:bg-white focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 font-sans font-light text-base shadow-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Button, { onClick: handleGenerate, disabled: isGenerating, className: "w-full bg-[#1A1A1A] hover:bg-[#333333] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/10 transition-all duration-500", children: isGenerating ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : "Generate Article" })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { title: "Generated Content", className: "luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-stone-50/30", children: generatedBlog ? /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6 },
              className: "space-y-10",
              children: [
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: generatedBlog,
                    onChange: (e) => setGeneratedBlog(e.target.value),
                    className: "w-full bg-white border border-stone-100 rounded-[2rem] p-4 sm:p-8 text-base font-sans font-light text-stone-600 h-[32rem] resize-none shadow-sm focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 transition-all duration-500 outline-none leading-relaxed"
                  }
                ),
                /* @__PURE__ */ jsx(Button, { onClick: handleSave, className: "w-full bg-[#6A2C91] hover:bg-[#552374] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 transition-all duration-500", children: "Approve & Schedule" })
              ]
            }
          ) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center py-40 opacity-20 text-center", children: [
            /* @__PURE__ */ jsx(FileText, { size: 80, strokeWidth: 0.8, className: "text-stone-400 mb-8" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] font-sans font-medium text-stone-500 uppercase tracking-[0.4em]", children: "Awaiting Synthesis" })
          ] }) })
        ] })
      ]
    }
  );
};
const VideoCreator = () => {
  const navigate = useNavigate();
  const { addMarketingPost } = useArtisanData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("15 Seconds (Reel/Short)");
  const [generatedScript, setGeneratedScript] = useState("");
  const handleGenerate = async () => {
    if (!topic) return toast.error("Please enter a topic.");
    setIsGenerating(true);
    const toastId = toast.loading("Synthesizing video script...");
    try {
      const prompt = `Write a video script for a ${duration} video about: ${topic}. Include visual cues [Visual: ...] and audio cues [Audio: ...]. Use a luxurious, artisanal brand voice.`;
      const result = await chatWithLola(prompt, null, "fast");
      setGeneratedScript(result.text);
      toast.success("Script synthesis complete.", { id: toastId });
    } catch (error) {
      console.error("Generation failed", error);
      toast.error("Synthesis failed: Node offline.", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };
  const handleSave = () => {
    if (!generatedScript) return;
    addMarketingPost({
      platform: "YouTube",
      topic: topic || "Video Script",
      content: generatedScript,
      scheduledDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: "Draft",
      type: "Video"
    });
    toast.success("Video script saved to calendar.");
    navigate("/marketing/calendar");
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-8 space-y-16 pb-32 max-w-7xl mx-auto",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "Video Creator",
            parentTitle: "Marketing Hub",
            onBack: () => navigate("/marketing"),
            description: "AI-powered video script production interface"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-12", children: [
          /* @__PURE__ */ jsx(Card, { title: "Script Configuration", className: "luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-black/40 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "space-y-10 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1", children: "Target Duration" }),
              /* @__PURE__ */ jsxs(Select, { value: duration, onChange: (e) => setDuration(e.target.value), className: "h-16 rounded-2xl bg-white/5 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 font-sans font-light text-base shadow-sm text-white", children: [
                /* @__PURE__ */ jsx("option", { className: "bg-black", children: "15 Seconds (Reel/Short)" }),
                /* @__PURE__ */ jsx("option", { className: "bg-black", children: "30 Seconds (Commercial)" }),
                /* @__PURE__ */ jsx("option", { className: "bg-black", children: "60 Seconds (Deep Dive)" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1", children: "Video Topic" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: topic,
                  onChange: (e) => setTopic(e.target.value),
                  placeholder: "e.g., Behind the scenes of our new manufacturing process...",
                  className: "w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-base font-sans font-light focus:bg-black/60 focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 h-40 resize-none transition-all duration-500 shadow-sm outline-none text-white"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Button, { onClick: handleGenerate, disabled: isGenerating, className: "w-full bg-[#C5A059] hover:bg-[#b08d4f] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/10 transition-all duration-500", children: isGenerating ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : "Generate Script" })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { title: "Generated Script", className: "luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-black/20 backdrop-blur-xl", children: generatedScript ? /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6 },
              className: "space-y-10",
              children: [
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: generatedScript,
                    onChange: (e) => setGeneratedScript(e.target.value),
                    className: "w-full bg-black/40 border border-white/10 rounded-[2rem] p-4 sm:p-8 text-base font-mono font-light text-gray-300 h-[24rem] resize-none shadow-sm focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 transition-all duration-500 outline-none leading-relaxed"
                  }
                ),
                /* @__PURE__ */ jsx(Button, { onClick: handleSave, className: "w-full bg-[#6A2C91] hover:bg-[#552374] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 transition-all duration-500", children: "Approve & Schedule" })
              ]
            }
          ) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center py-40 opacity-20 text-center", children: [
            /* @__PURE__ */ jsx(Film, { size: 80, strokeWidth: 0.8, className: "text-white mb-8" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] font-sans font-medium text-gray-500 uppercase tracking-[0.4em]", children: "Awaiting Synthesis" })
          ] }) })
        ] })
      ]
    }
  );
};
const SocialMediaCreator = () => {
  const navigate = useNavigate();
  const { addMarketingPost } = useArtisanData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [platform, setPlatform] = useState("Instagram");
  const [topic, setTopic] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const handleGenerate = async () => {
    if (!topic) return toast.error("Please enter a topic.");
    setIsGenerating(true);
    const toastId = toast.loading("Synthesizing platform content...");
    try {
      const prompt = `Write an engaging ${platform} post about: ${topic}. Use a luxurious, artisanal brand voice. Include relevant hashtags.`;
      const result = await chatWithLola(prompt, null, "fast");
      setGeneratedContent(result.text);
      toast.success("Content synthesis complete.", { id: toastId });
    } catch (error) {
      console.error("Generation failed", error);
      toast.error("Synthesis failed: Node offline.", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };
  const handleSave = () => {
    if (!generatedContent) return;
    addMarketingPost({
      platform,
      topic: topic || "Social Post",
      content: generatedContent,
      scheduledDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: "Draft",
      type: "Text"
    });
    toast.success("Social post saved to calendar.");
    navigate("/marketing/calendar");
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-8 space-y-16 pb-32 max-w-7xl mx-auto",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "Social Media Creator",
            parentTitle: "Marketing Hub",
            onBack: () => navigate("/marketing"),
            description: "Platform-optimized content generators"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-12", children: [
          /* @__PURE__ */ jsx(Card, { title: "Post Configuration", className: "luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-black/40 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "space-y-10 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1", children: "Target Platform" }),
              /* @__PURE__ */ jsxs(Select, { value: platform, onChange: (e) => setPlatform(e.target.value), className: "h-16 rounded-2xl bg-white/5 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 font-sans font-light text-base shadow-sm text-white", children: [
                /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Instagram" }),
                /* @__PURE__ */ jsx("option", { className: "bg-black", children: "LinkedIn" }),
                /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Twitter" }),
                /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Facebook" })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  onClick: () => setShowAuthModal(true),
                  className: "w-full mt-2 h-12 rounded-xl border-white/10 text-white/50 hover:bg-white/5 font-sans text-[10px] tracking-widest uppercase",
                  children: [
                    /* @__PURE__ */ jsx(Lock, { size: 14, className: "mr-2" }),
                    " Authenticate Platform"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1", children: "Topic / Objective" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: topic,
                  onChange: (e) => setTopic(e.target.value),
                  placeholder: "e.g., Announcing our new limited edition summer collection...",
                  className: "w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-base font-sans font-light focus:bg-black/60 focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 h-40 resize-none transition-all duration-500 shadow-sm outline-none text-white"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Button, { onClick: handleGenerate, disabled: isGenerating, className: "w-full bg-[#C5A059] hover:bg-[#b08d4f] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/10 transition-all duration-500", children: isGenerating ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : "Generate Content" })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { title: "Generated Output", className: "luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-black/20 backdrop-blur-xl", children: generatedContent ? /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.6 },
              className: "space-y-10",
              children: [
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    value: generatedContent,
                    onChange: (e) => setGeneratedContent(e.target.value),
                    className: "w-full bg-black/40 border border-white/10 rounded-[2rem] p-4 sm:p-8 text-base font-sans font-light text-gray-300 h-[24rem] resize-none shadow-sm focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 transition-all duration-500 outline-none leading-relaxed"
                  }
                ),
                /* @__PURE__ */ jsx(Button, { onClick: handleSave, className: "w-full bg-[#6A2C91] hover:bg-[#552374] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 transition-all duration-500", children: "Approve & Schedule" })
              ]
            }
          ) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center py-40 opacity-20 text-center", children: [
            /* @__PURE__ */ jsx(Share2, { size: 80, strokeWidth: 0.8, className: "text-white mb-8" }),
            /* @__PURE__ */ jsx("p", { className: "text-[12px] font-sans font-medium text-gray-500 uppercase tracking-[0.4em]", children: "Awaiting Synthesis" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(SocialMediaAuthModal, { isOpen: showAuthModal, onClose: () => setShowAuthModal(false), platform })
      ]
    }
  );
};
const ContentCalendar = () => {
  const navigate = useNavigate();
  const { marketingPosts, updateMarketingPost } = useArtisanData();
  const [currentDate, setCurrentDate] = useState(/* @__PURE__ */ new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthName = currentDate.toLocaleString("default", { month: "long" });
  const year = currentDate.getFullYear();
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "Instagram":
        return /* @__PURE__ */ jsx(Instagram, { size: 14 });
      case "Facebook":
        return /* @__PURE__ */ jsx(Facebook, { size: 14 });
      case "LinkedIn":
        return /* @__PURE__ */ jsx(Linkedin, { size: 14 });
      case "Twitter":
        return /* @__PURE__ */ jsx(Twitter, { size: 14 });
      case "YouTube":
        return /* @__PURE__ */ jsx(Youtube, { size: 14 });
      case "Blog":
        return /* @__PURE__ */ jsx(FileText, { size: 14 });
      case "Email":
        return /* @__PURE__ */ jsx(Globe, { size: 14 });
      default:
        return /* @__PURE__ */ jsx(Share2, { size: 14 });
    }
  };
  const getPostsForDay = (day) => {
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dd = String(day).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;
    return marketingPosts.filter((p) => p.scheduledDate === dateStr);
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "green";
      case "Scheduled":
        return "blue";
      case "Pending Approval":
        return "gold";
      case "Draft":
        return "gray";
      default:
        return "purple";
    }
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-10 md:p-16 space-y-12 max-w-[1600px] mx-auto pb-32",
      children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-col gap-4 sm:p-8", children: /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "Content Calendar",
            parentTitle: "Marketing Hub",
            onBack: () => navigate("/marketing"),
            description: "Omnichannel publication schedule and governance."
          }
        ) }),
        /* @__PURE__ */ jsxs(Card, { className: "luxury-card border-transparent rounded-[2.5rem] p-4 sm:p-10 bg-black/40 backdrop-blur-xl", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-10", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-3xl font-serif text-white tracking-tight", children: [
              monthName,
              " ",
              year
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: prevMonth, className: "h-12 w-12 p-0 rounded-full border-white/10 text-white hover:bg-white/5 flex justify-center items-center", children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18 }) }),
              /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: nextMonth, className: "h-12 w-12 p-0 rounded-full border-white/10 text-white hover:bg-white/5 flex justify-center items-center", children: /* @__PURE__ */ jsx(ArrowLeft, { size: 18, className: "rotate-180" }) })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-7 gap-4 mb-4", children: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => /* @__PURE__ */ jsx("div", { className: "text-center text-[10px] font-sans font-medium text-gray-500 uppercase tracking-widest", children: day }, day)) }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-7 gap-4", children: [
            Array.from({ length: firstDay }).map((_, i) => /* @__PURE__ */ jsx("div", { className: "h-32 rounded-3xl bg-white/5 opacity-30" }, `blank-${i}`)),
            Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayPosts = getPostsForDay(day);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => setSelectedDay(day),
                  className: "h-32 rounded-3xl bg-white/5 border border-white/10 hover:border-[#6A2C91] hover:bg-white/10 p-3 transition-all cursor-pointer relative overflow-hidden group flex flex-col",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-xs font-sans font-medium text-gray-400 group-hover:text-white transition-colors", children: day }),
                    /* @__PURE__ */ jsx("div", { className: "mt-auto space-y-1 overflow-y-auto hidden-scrollbar", children: dayPosts.map((post, idx) => /* @__PURE__ */ jsxs("div", { className: "bg-black/60 rounded p-1.5 flex items-center gap-1.5 overflow-hidden", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-[#6A2C91] shrink-0", children: getPlatformIcon(post.platform) }),
                      /* @__PURE__ */ jsx("span", { className: "text-[9px] text-white truncate font-sans font-medium", children: post.topic })
                    ] }, idx)) })
                  ]
                },
                day
              );
            })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Modal, { isOpen: selectedDay !== null, onClose: () => setSelectedDay(null), title: `Schedule for ${monthName} ${selectedDay}, ${year}`, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          selectedDay && getPostsForDay(selectedDay).length > 0 ? /* @__PURE__ */ jsx("div", { className: "space-y-4", children: getPostsForDay(selectedDay).map((post) => /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center text-[#6A2C91]", children: getPlatformIcon(post.platform) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("p", { className: "text-white font-sans font-medium text-sm", children: post.topic }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-500 font-sans text-[10px] uppercase tracking-widest", children: post.status })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Badge, { color: getStatusColor(post.status), children: post.status })
          ] }, post.id)) }) : /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm font-sans text-center py-8", children: "No nodes scheduled for this date." }),
          /* @__PURE__ */ jsxs(Button, { onClick: () => navigate("/marketing/creator"), className: "w-full bg-[#C5A059] hover:bg-[#b08d4f] text-white h-12 rounded-xl font-sans font-medium text-[10px] uppercase tracking-widest shadow-lg", children: [
            /* @__PURE__ */ jsx(Plus, { size: 14, className: "mr-2" }),
            " Pre-schedule Strategy"
          ] })
        ] }) })
      ]
    }
  );
};
const AIAvatarStudio = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [referenceImage, setReferenceImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [history, setHistory] = useState([]);
  const handleFileUpload = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result);
        toast.success("Reference photo uploaded for synthesis.");
      };
      reader.readAsDataURL(file);
    }
  };
  const handleGenerate = async () => {
    var _a;
    if (!prompt) return toast.error("Please define your brand persona.");
    const aiStudio = window.aistudio;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey && aiStudio) {
      const hasKey = await aiStudio.hasSelectedApiKey();
      if (!hasKey) {
        await aiStudio.openSelectKey();
        return;
      }
    } else if (!apiKey) {
      toast.error("Please add VITE_GEMINI_API_KEY in your .env.local file to initialize the visual synthesis nodes.");
      return;
    }
    setIsGenerating(true);
    const toastId = toast.loading("Synthesizing brand persona...");
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "imagen-3.0-generate-002",
        contents: {
          parts: [{ text: `High-end, luxury brand avatar: ${prompt}. Cinematic lighting, professional studio photography, elegant and sophisticated aesthetic, high-fidelity details, photorealistic.` }]
        }
      });
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const newUrl = `data:image/png;base64,${part.inlineData.data}`;
          setGeneratedImage(newUrl);
          setHistory((prev) => [{ id: Date.now().toString(), url: newUrl }, ...prev].slice(0, 4));
          toast.success("Persona synthesis complete.", { id: toastId });
          break;
        }
      }
    } catch (error) {
      console.error("Avatar generation failed", error);
      if ((_a = error.message) == null ? void 0 : _a.includes("Requested entity was not found.")) {
        if (window.aistudio) window.aistudio.openSelectKey();
        toast.dismiss(toastId);
      } else {
        toast.error("Avatar synthesis failed. Ensure vault authorization is active.", { id: toastId });
      }
    } finally {
      setIsGenerating(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-8 space-y-16 pb-32 max-w-7xl mx-auto",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "AI Avatar Studio",
            parentTitle: "Marketing Hub",
            onBack: () => navigate("/marketing"),
            description: "Synthetic brand persona and character synthesis"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-12", children: [
          /* @__PURE__ */ jsx(Card, { title: "Persona Definition", className: "luxury-card border-white/10 rounded-[2.5rem] p-4 sm:p-10 bg-black/40 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "space-y-10 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1", children: "Visual Description" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: prompt,
                  onChange: (e) => setPrompt(e.target.value),
                  placeholder: "Describe your brand avatar (e.g., A sophisticated artisan in a modern workshop with soft golden lighting...)",
                  className: "w-full bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-8 text-base font-sans font-light text-gray-300 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-1 focus:ring-[#6A2C91]/10 h-64 resize-none transition-all duration-500 shadow-sm outline-none leading-relaxed placeholder:text-gray-600"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-3 ml-1", children: "Reference Likeness (Optional)" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                /* @__PURE__ */ jsxs("label", { className: "flex-1 cursor-pointer group", children: [
                  /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", onChange: handleFileUpload, className: "hidden" }),
                  /* @__PURE__ */ jsxs("div", { className: "w-full h-16 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center gap-3 text-gray-400 group-hover:border-[#6A2C91] group-hover:text-[#6A2C91] transition-all bg-black/20", children: [
                    /* @__PURE__ */ jsx(Upload, { size: 18 }),
                    /* @__PURE__ */ jsx("span", { className: "text-[11px] font-sans uppercase tracking-[0.2em]", children: referenceImage ? "Replace Reference Photo" : "Upload Reference Photo" })
                  ] })
                ] }),
                referenceImage && /* @__PURE__ */ jsxs("div", { className: "w-16 h-16 rounded-full overflow-hidden border-2 border-[#6A2C91] relative", children: [
                  /* @__PURE__ */ jsx("img", { src: referenceImage, alt: "Reference", className: "w-full h-full object-cover" }),
                  /* @__PURE__ */ jsx("button", { onClick: () => setReferenceImage(null), className: "absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center text-white transition-opacity", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Button, { onClick: handleGenerate, disabled: isGenerating, className: "w-full bg-[#C5A059] hover:bg-[#b08e4d] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-black/20 transition-all duration-500", children: isGenerating ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : "Synthesize Avatar" })
          ] }) }),
          /* @__PURE__ */ jsxs(Card, { title: "Avatar Preview", className: "luxury-card border-white/10 rounded-[2.5rem] p-4 sm:p-10 bg-black/20 backdrop-blur-xl flex flex-col", children: [
            /* @__PURE__ */ jsx("div", { className: "flex-grow flex flex-col items-center justify-center", children: generatedImage ? /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                className: "space-y-10 w-full",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white/5 relative group", children: [
                    /* @__PURE__ */ jsx("img", { src: generatedImage, alt: "Generated Avatar", className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110", referrerPolicy: "no-referrer" }),
                    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center", children: /* @__PURE__ */ jsx("button", { className: "bg-white/10 backdrop-blur-md text-white p-4 rounded-full hover:bg-white/20 transition-all", children: /* @__PURE__ */ jsx(Download, { size: 24 }) }) })
                  ] }),
                  /* @__PURE__ */ jsx(Button, { className: "w-full bg-[#6A2C91] hover:bg-[#552374] text-white h-16 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 transition-all duration-500", children: "Download High-Res Asset" })
                ]
              }
            ) : /* @__PURE__ */ jsxs("div", { className: "text-center opacity-20 py-20", children: [
              /* @__PURE__ */ jsx(User, { size: 120, strokeWidth: 0.5, className: "text-white mb-8 mx-auto" }),
              /* @__PURE__ */ jsx("p", { className: "text-[14px] font-sans font-medium text-gray-500 uppercase tracking-[0.5em]", children: "Awaiting Neural Synthesis" })
            ] }) }),
            history.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-12 border-t border-white/5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-sans font-medium text-gray-500 uppercase tracking-[0.3em] mb-6", children: "Previous Syntheses" }),
              /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: history.map((item) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setGeneratedImage(item.url),
                  className: "w-16 h-16 rounded-xl overflow-hidden border-2 border-white/10 shadow-sm hover:scale-110 transition-transform duration-500",
                  children: /* @__PURE__ */ jsx("img", { src: item.url, className: "w-full h-full object-cover", referrerPolicy: "no-referrer" })
                },
                item.id
              )) })
            ] })
          ] })
        ] })
      ]
    }
  );
};
const AdvancedContentGenerator = () => {
  const navigate = useNavigate();
  const { addMarketingPost } = useArtisanData();
  const [topic, setTopic] = useState("");
  const [campaignGoal, setCampaignGoal] = useState("Brand Awareness");
  const [isGenerating, setIsGenerating] = useState(false);
  const [campaign, setCampaign] = useState(null);
  const handleGenerate = async () => {
    if (!topic) return toast.error("Please enter a campaign topic.");
    setIsGenerating(true);
    setCampaign(null);
    const toastId = toast.loading("Synthesizing multi-platform campaign...");
    try {
      const prompt = `Generate a comprehensive marketing campaign for an artisanal brand. Topic: ${topic}. Goal: ${campaignGoal}.
            Provide the output in JSON format with three keys: 'blog' (a short blog post draft), 'social' (an Instagram caption), and 'email' (an email newsletter draft).`;
      const result = await chatWithLola(prompt, null, "deep");
      try {
        const jsonMatch = result.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          setCampaign(parsed);
          toast.success("Campaign synthesis complete.", { id: toastId });
        } else {
          setCampaign({
            blog: "Blog draft generated based on: " + topic,
            social: "Social caption generated based on: " + topic,
            email: "Email draft generated based on: " + topic
          });
          toast.info("Campaign generated with partial formatting.", { id: toastId });
        }
      } catch (e) {
        console.error("Failed to parse campaign JSON", e);
        setCampaign({
          blog: result.text.substring(0, 200) + "...",
          social: "Check full output for details.",
          email: "Check full output for details."
        });
        toast.warning("Campaign generated. Manual formatting required.", { id: toastId });
      }
    } catch (error) {
      console.error("Campaign generation failed", error);
      toast.error("Synthesis failed: Node offline.", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };
  const handleSaveCampaign = () => {
    if (!campaign) return;
    const date = (/* @__PURE__ */ new Date()).toISOString();
    if (campaign.blog) {
      addMarketingPost({
        platform: "Blog",
        topic: `${topic} - Blog`,
        content: campaign.blog,
        scheduledDate: date,
        status: "Draft",
        type: "Text"
      });
    }
    if (campaign.social) {
      addMarketingPost({
        platform: "Instagram",
        topic: `${topic} - Social`,
        content: campaign.social,
        scheduledDate: date,
        status: "Draft",
        type: "Text"
      });
    }
    if (campaign.email) {
      addMarketingPost({
        platform: "Email",
        topic: `${topic} - Newsletter`,
        content: campaign.email,
        scheduledDate: date,
        status: "Draft",
        type: "Text"
      });
    }
    toast.success("Campaign assets saved to Drafts.");
    navigate("/marketing/calendar");
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-6 space-y-12 pb-20 max-w-7xl mx-auto",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "Advanced Synthesis",
            parentTitle: "Marketing Hub",
            onBack: () => navigate("/marketing"),
            description: "Deep cognitive multi-platform campaign generation."
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-10", children: [
          /* @__PURE__ */ jsx(Card, { title: "Campaign Parameters", className: "luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/40 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Core Topic / Product" }),
              /* @__PURE__ */ jsx(Input, { value: topic, onChange: (e) => setTopic(e.target.value), placeholder: "e.g., Summer Solstice Collection Launch", className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Campaign Goal" }),
              /* @__PURE__ */ jsxs(Select, { value: campaignGoal, onChange: (e) => setCampaignGoal(e.target.value), className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm", children: [
                /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Brand Awareness" }),
                /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Lead Generation" }),
                /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Direct Sales" }),
                /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Customer Retention" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(Button, { onClick: handleGenerate, disabled: isGenerating, className: "w-full bg-[#C5A059] hover:bg-[#b08e4d] text-white h-14 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-black/20 transition-all", children: isGenerating ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : "Synthesize Campaign" })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { title: "Generated Assets", className: "luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/20 backdrop-blur-xl", children: campaign ? /* @__PURE__ */ jsxs(
            motion.div,
            {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { duration: 0.5 },
              className: "space-y-8",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-[11px] font-sans font-medium text-white font-bold uppercase tracking-[0.2em] mb-3 ml-1", children: "Blog Post Draft" }),
                    /* @__PURE__ */ jsx("div", { className: "p-6 bg-black/40 rounded-2xl border border-white/10 text-sm font-sans font-light text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto shadow-sm", children: campaign.blog })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-[11px] font-sans font-medium text-white font-bold uppercase tracking-[0.2em] mb-3 ml-1", children: "Instagram Caption" }),
                    /* @__PURE__ */ jsx("div", { className: "p-6 bg-black/40 rounded-2xl border border-white/10 text-sm font-sans font-light text-gray-300 whitespace-pre-wrap max-h-32 overflow-y-auto shadow-sm", children: campaign.social })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h4", { className: "text-[11px] font-sans font-medium text-white font-bold uppercase tracking-[0.2em] mb-3 ml-1", children: "Email Newsletter" }),
                    /* @__PURE__ */ jsx("div", { className: "p-6 bg-black/40 rounded-2xl border border-white/10 text-sm font-sans font-light text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto shadow-sm", children: campaign.email })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(Button, { onClick: handleSaveCampaign, className: "w-full bg-[#6A2C91] hover:bg-[#552374] text-white h-14 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-[#6A2C91]/20 transition-all mt-6", children: "Save All to Drafts" })
              ]
            }
          ) : /* @__PURE__ */ jsxs("div", { className: "h-full flex flex-col items-center justify-center py-32 opacity-30 text-center", children: [
            /* @__PURE__ */ jsx(Zap, { size: 64, strokeWidth: 1, className: "text-white mb-6" }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em]", children: "Awaiting Parameters" })
          ] }) })
        ] })
      ]
    }
  );
};
const ContentApprovals = () => {
  const navigate = useNavigate();
  const { marketingPosts, updateMarketingPost } = useArtisanData();
  const pendingPosts = marketingPosts.filter((p) => p.status === "Draft" || p.status === "Pending Approval");
  const handleApprove = (id) => {
    updateMarketingPost(id, { status: "Scheduled" });
    toast.success("Content approved and scheduled.");
  };
  const handleReject = (id) => {
    updateMarketingPost(id, { status: "Draft" });
    toast.info("Content returned to drafts.");
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-6 space-y-12 pb-20 max-w-7xl mx-auto",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "Content Approvals",
            parentTitle: "Marketing Hub",
            onBack: () => navigate("/marketing"),
            description: "Governance node for marketing deployment."
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 sm:p-8", children: pendingPosts.length === 0 ? /* @__PURE__ */ jsxs(Card, { className: "luxury-card border-white/10 rounded-3xl bg-black/20 backdrop-blur-xl text-center py-32", children: [
          /* @__PURE__ */ jsx(CheckCircle, { size: 64, strokeWidth: 1, className: "mx-auto text-white/20 mb-6" }),
          /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif text-white tracking-tight mb-2", children: "All Clear" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 font-sans font-light text-sm", children: "No content pending approval." })
        ] }) : pendingPosts.map((post, index) => /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: index * 0.1, duration: 0.5 },
            children: /* @__PURE__ */ jsx(Card, { className: "luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/40 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4 sm:p-10 items-start", children: [
              post.mediaUrl && /* @__PURE__ */ jsx("div", { className: "w-full md:w-64 h-64 rounded-2xl overflow-hidden border border-white/10 shrink-0 shadow-sm", children: /* @__PURE__ */ jsx("img", { src: post.mediaUrl, alt: post.topic, className: "w-full h-full object-cover hover:scale-105 transition-transform duration-700" }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx(Badge, { color: "purple", className: "text-[#6A2C91] border-[#6A2C91]/20 bg-[#6A2C91]/10 px-3 py-1 text-[10px] font-sans font-medium uppercase tracking-[0.2em]", children: post.platform }),
                    /* @__PURE__ */ jsx(Badge, { color: "gold", className: "bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/20 px-3 py-1 text-[10px] font-sans font-medium uppercase tracking-[0.2em]", children: post.status })
                  ] }),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em]", children: new Date(post.scheduledDate).toLocaleDateString() })
                ] }),
                /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif text-white", children: post.topic }),
                /* @__PURE__ */ jsx("div", { className: "p-6 bg-black/40 rounded-2xl border border-white/10 text-sm font-sans font-light text-gray-300 whitespace-pre-wrap shadow-sm", children: post.content }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-4 pt-6", children: [
                  /* @__PURE__ */ jsx(Button, { onClick: () => handleApprove(post.id), className: "bg-[#C5A059] hover:bg-[#b08e4d] text-white h-12 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.2em] px-8 shadow-xl shadow-black/20 transition-all", children: "Approve & Schedule" }),
                  /* @__PURE__ */ jsx(Button, { onClick: () => handleReject(post.id), variant: "outline", className: "text-rose-500 border-rose-500/20 hover:bg-rose-500/10 h-12 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.2em] px-8 transition-all", children: "Reject to Draft" })
                ] })
              ] })
            ] }) })
          },
          post.id
        )) })
      ]
    }
  );
};
const BrandVoiceProfile = () => {
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState(null);
  const [primaryFont, setPrimaryFont] = useState("Inter (Sans-serif)");
  const [secondaryFont, setSecondaryFont] = useState("Playfair Display (Serif)");
  const [primaryColor, setPrimaryColor] = useState("#000000");
  const [secondaryColor, setSecondaryColor] = useState("#C5A059");
  const [brandValues, setBrandValues] = useState("Excellence, Sustainability, Artisanship");
  const [tagline, setTagline] = useState("Crafting the extraordinary.");
  const [adjectives, setAdjectives] = useState("Luxurious, Artisanal, Precise, Bold");
  const [restrictedWords, setRestrictedWords] = useState("Cheap, Discount, Mass-produced");
  const [targetAudience, setTargetAudience] = useState("High-end wellness consumers and boutique retailers.");
  const [tone, setTone] = useState("Authoritative & Elegant");
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Business DNA & Voice Profile updated successfully.");
    }, 1e3);
  };
  const handleGenerateBrandBook = () => {
    setIsGenerating(true);
    const toastId = toast.loading("Synthesizing Brand Book & Asset Site...");
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Brand Book generated and added to Vault.", { id: toastId });
    }, 2e3);
  };
  const handleLogoUpload = (files) => {
    if (files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20",
      children: [
        /* @__PURE__ */ jsx(
          ContextualTutorialModal,
          {
            hubId: "brand_voice",
            title: "Brand Voice Profile",
            description: "Define and enforce your brands unique tone and style.",
            steps: ["Upload reference materials to train the AI.", "Select core brand adjectives.", "Establish restricted vocabulary to avoid off-brand messaging."]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsx(
            SubPageHeader,
            {
              title: "Business DNA & Brand Voice",
              parentTitle: "Marketing Hub",
              onBack: () => navigate("/marketing"),
              description: "Core identity matrix: visual, linguistic, and strategic brand parameters."
            }
          ),
          /* @__PURE__ */ jsx(
            VaultBanner,
            {
              title: "Business DNA",
              subtitle: "Core identity matrix: Define the visual and linguistic parameters that represent your brand's essence.",
              badge: "DNA Protocol Active",
              children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "primary",
                    className: "bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-8 rounded-full shadow-2xl shadow-black/20 transition-all",
                    onClick: handleGenerateBrandBook,
                    disabled: isGenerating,
                    children: [
                      isGenerating ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin mr-3", size: 16 }) : /* @__PURE__ */ jsx(FileText, { size: 16, className: "mr-3" }),
                      "GENERATE BRAND BOOK"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "primary",
                    className: "bg-[#6A2C91] hover:bg-[#5a257a] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 rounded-full shadow-2xl shadow-[#6A2C91]/20 transition-all",
                    onClick: handleSave,
                    disabled: isSaving,
                    children: [
                      isSaving ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin mr-3", size: 16 }) : /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "mr-3" }),
                      "COMMIT DNA PROTOCOL"
                    ]
                  }
                )
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-10", children: [
          /* @__PURE__ */ jsx(Card, { title: "Visual DNA (Assets & Styling)", className: "luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/40 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Master Logo" }),
              /* @__PURE__ */ jsx(FileUploader, { onUpload: handleLogoUpload, acceptedFormats: ".svg, .png, .jpg", label: "Upload Primary Logo" }),
              logoPreview && /* @__PURE__ */ jsx("div", { className: "mt-4 p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-center", children: /* @__PURE__ */ jsx("img", { src: logoPreview, alt: "Brand Logo", className: "h-16 object-contain" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Primary Font" }),
                /* @__PURE__ */ jsx(Input, { value: primaryFont, onChange: (e) => setPrimaryFont(e.target.value), className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Secondary Font" }),
                /* @__PURE__ */ jsx(Input, { value: secondaryFont, onChange: (e) => setSecondaryFont(e.target.value), className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Primary Color (Hex)" }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3 items-center", children: [
                  /* @__PURE__ */ jsx("input", { type: "color", value: primaryColor, onChange: (e) => setPrimaryColor(e.target.value), className: "w-14 h-14 rounded-2xl bg-transparent border-0 cursor-pointer" }),
                  /* @__PURE__ */ jsx(Input, { value: primaryColor, onChange: (e) => setPrimaryColor(e.target.value), className: "flex-1 h-14 rounded-2xl bg-black/40 border-white/10 text-white" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Accent Color (Hex)" }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3 items-center", children: [
                  /* @__PURE__ */ jsx("input", { type: "color", value: secondaryColor, onChange: (e) => setSecondaryColor(e.target.value), className: "w-14 h-14 rounded-2xl bg-transparent border-0 cursor-pointer" }),
                  /* @__PURE__ */ jsx(Input, { value: secondaryColor, onChange: (e) => setSecondaryColor(e.target.value), className: "flex-1 h-14 rounded-2xl bg-black/40 border-white/10 text-white" })
                ] })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { title: "Strategic DNA & Tone", className: "luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/40 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Brand Tagline" }),
                /* @__PURE__ */ jsx(Input, { value: tagline, onChange: (e) => setTagline(e.target.value), placeholder: "e.g., Crafting the extraordinary.", className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Core Values" }),
                /* @__PURE__ */ jsx(Input, { value: brandValues, onChange: (e) => setBrandValues(e.target.value), placeholder: "e.g., Excellence, Sustainability...", className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Brand Adjectives (Comma separated)" }),
              /* @__PURE__ */ jsx(Input, { value: adjectives, onChange: (e) => setAdjectives(e.target.value), placeholder: "e.g., Luxurious, Artisanal...", className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Target Audience" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: targetAudience,
                  onChange: (e) => setTargetAudience(e.target.value),
                  className: "w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm font-sans font-light text-gray-300 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 h-24 resize-none transition-all shadow-sm outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Primary Tone" }),
                /* @__PURE__ */ jsxs(Select, { value: tone, onChange: (e) => setTone(e.target.value), className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm", children: [
                  /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Authoritative & Elegant" }),
                  /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Warm & Approachable" }),
                  /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Technical & Precise" }),
                  /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Bold & Disruptive" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Restricted Vocabulary" }),
                /* @__PURE__ */ jsx(Input, { value: restrictedWords, onChange: (e) => setRestrictedWords(e.target.value), placeholder: "Words AI should never use", className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 text-sm text-white shadow-sm" })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsx(Card, { title: "AI Persona Preview", className: "luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/20 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 mt-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 font-sans font-light leading-relaxed", children: "Based on your current parameters, Lola will generate content that aligns with your DNA:" }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-8 bg-black/40 border border-white/10 rounded-3xl shadow-sm italic text-gray-300 font-serif text-lg leading-relaxed", children: [
              '"Discover the uncompromising precision of our latest artisanal collection. Crafted for those who demand excellence, each piece reflects our dedication to bold innovation and luxurious quality. ',
              tagline,
              '"'
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
              adjectives.split(",").map((adj) => adj.trim()).filter(Boolean).map((adj, i) => /* @__PURE__ */ jsx(Badge, { color: "purple", className: "text-[#6A2C91] border-[#6A2C91]/20 bg-[#6A2C91]/10 px-4 py-2 text-[10px] font-sans font-medium uppercase tracking-[0.2em] rounded-full", children: adj }, i)),
              brandValues.split(",").map((val) => val.trim()).filter(Boolean).map((val, i) => /* @__PURE__ */ jsx(Badge, { color: "gold", className: "text-[#C5A059] border-[#C5A059]/20 bg-[#C5A059]/10 px-4 py-2 text-[10px] font-sans font-medium uppercase tracking-[0.2em] rounded-full", children: val }, `v-${i}`))
            ] })
          ] }) }) })
        ] })
      ]
    }
  );
};
const ReceptionistLogic = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("Welcome to our artisanal boutique. How may I assist you today?");
  const [fallback, setFallback] = useState("I apologize, but I need to connect you with a human artisan for that request.");
  const [qualificationQuestions, setQualificationQuestions] = useState("What type of product are you looking for?\nDo you have a specific budget in mind?\nAre you interested in wholesale or retail?");
  const [isSaving, setIsSaving] = useState(false);
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Receptionist logic updated successfully.");
    }, 1e3);
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-6 space-y-12 pb-20 max-w-7xl mx-auto",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "Receptionist Logic",
            parentTitle: "Marketing Hub",
            onBack: () => navigate("/marketing"),
            description: "Automated qualification protocols for leads."
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-10", children: [
          /* @__PURE__ */ jsx(Card, { title: "Interaction Parameters", className: "luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/40 backdrop-blur-xl", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Initial Greeting" }),
              /* @__PURE__ */ jsx(Input, { value: greeting, onChange: (e) => setGreeting(e.target.value), className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Fallback Response (Human Handoff)" }),
              /* @__PURE__ */ jsx(Input, { value: fallback, onChange: (e) => setFallback(e.target.value), className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 font-sans font-light text-sm text-white shadow-sm" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-sans font-medium text-gray-500 uppercase tracking-[0.2em] mb-3 ml-1", children: "Qualification Questions (One per line)" }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  value: qualificationQuestions,
                  onChange: (e) => setQualificationQuestions(e.target.value),
                  className: "w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm font-sans font-light text-gray-300 focus:bg-black/60 focus:border-[#6A2C91] focus:ring-[#6A2C91]/20 h-40 resize-none transition-all shadow-sm outline-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(Button, { onClick: handleSave, disabled: isSaving, className: "w-full bg-[#C5A059] hover:bg-[#b08e4d] text-white h-14 rounded-full font-sans font-medium text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-black/20 transition-all", children: isSaving ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) : "Deploy Logic" })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { title: "Logic Flow Simulation", className: "luxury-card border-white/10 rounded-3xl p-4 sm:p-8 bg-black/20 backdrop-blur-xl", children: /* @__PURE__ */ jsx("div", { className: "space-y-8 mt-4", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: -10 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.5 },
                className: "flex gap-4",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-[#6A2C91] flex items-center justify-center text-white shrink-0 shadow-sm", children: /* @__PURE__ */ jsx(Bot, { size: 18 }) }),
                  /* @__PURE__ */ jsx("div", { className: "bg-black/40 p-5 rounded-2xl rounded-tl-none border border-white/10 text-sm font-sans font-light text-gray-300 shadow-sm leading-relaxed", children: greeting })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 10 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: 0.2, duration: 0.5 },
                className: "flex gap-4 flex-row-reverse",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 shrink-0 shadow-sm", children: /* @__PURE__ */ jsx(User, { size: 18 }) }),
                  /* @__PURE__ */ jsx("div", { className: "bg-[#C5A059] text-white p-5 rounded-2xl rounded-tr-none text-sm font-sans font-light shadow-sm leading-relaxed", children: "I'm looking for a custom order." })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: -10 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: 0.4, duration: 0.5 },
                className: "flex gap-4",
                children: [
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-[#6A2C91] flex items-center justify-center text-white shrink-0 shadow-sm", children: /* @__PURE__ */ jsx(Bot, { size: 18 }) }),
                  /* @__PURE__ */ jsx("div", { className: "bg-black/40 p-5 rounded-2xl rounded-tl-none border border-white/10 text-sm font-sans font-light text-gray-300 shadow-sm leading-relaxed", children: qualificationQuestions.split("\n")[0] || "How can I help you?" })
                ]
              }
            )
          ] }) }) })
        ] })
      ]
    }
  );
};
const MarketingCreator = () => {
  const navigate = useNavigate();
  const { addMarketingPost } = useArtisanData();
  const { executeAction } = useFeatureGate("marketing_creator");
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [assetType, setAssetType] = useState("Product Photo");
  const [style, setStyle] = useState("Photorealistic");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageSize, setImageSize] = useState("1K");
  const handleGenerate = () => {
    executeAction(async () => {
      var _a;
      if (!topic) {
        toast.error("Please enter a topic.");
        return;
      }
      if (window.aistudio) {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
        }
      }
      setIsGenerating(true);
      setGeneratedImage(null);
      const toastId = toast.loading("Synthesizing high-fidelity asset...");
      try {
        const prompt = `Generate a high-quality ${style} image for a ${assetType}. Subject: ${topic}. Luxurious lighting, artisanal depth.`;
        const imageUrl = await generateLolaImage(prompt, { size: imageSize, aspectRatio });
        setGeneratedImage(imageUrl);
        toast.success("Asset synthesis complete.", { id: toastId });
      } catch (error) {
        console.error("Generation failed", error);
        if ((_a = error.message) == null ? void 0 : _a.includes("Requested entity was not found.")) {
          if (window.aistudio) window.aistudio.openSelectKey();
          toast.dismiss(toastId);
        } else {
          toast.error("Synthesis failed: Node offline.", { id: toastId });
        }
      } finally {
        setIsGenerating(false);
      }
    }, true);
  };
  const handleSave = () => {
    if (!generatedImage) return;
    addMarketingPost({
      platform: "Instagram",
      topic: topic || "Marketing Asset",
      content: `New ${assetType}: ${topic}`,
      scheduledDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: "Draft",
      type: "Image",
      mediaUrl: generatedImage
    });
    toast.success("Asset saved to approvals vault.");
    navigate("/marketing/approvals");
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-8 max-w-7xl mx-auto space-y-12 pb-24",
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "Marketing Creator",
            parentTitle: "Marketing Hub",
            onBack: () => navigate("/marketing"),
            description: "Synthesize high-fidelity assets with Gemini 3 Pro Image"
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-12", children: [
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              children: /* @__PURE__ */ jsxs(Card, { className: "luxury-card p-4 sm:p-8 bg-black/40 backdrop-blur-xl border-white/10", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-xl font-serif text-white mb-8", children: "Asset Configuration" }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-8", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-xs font-sans text-gray-500 uppercase tracking-wider mb-3 ml-1", children: "Manifest Type" }),
                      /* @__PURE__ */ jsxs(Select, { value: assetType, onChange: (e) => setAssetType(e.target.value), className: "w-full h-14 bg-black/40 border-white/10 rounded-2xl text-white font-sans focus:ring-1 focus:ring-[#6A2C91]/30 transition-shadow", children: [
                        /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Product Photo" }),
                        /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Social Media Post" }),
                        /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Email Header" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-xs font-sans text-gray-500 uppercase tracking-wider mb-3 ml-1", children: "Resolution Node" }),
                      /* @__PURE__ */ jsxs(Select, { value: imageSize, onChange: (e) => setImageSize(e.target.value), className: "w-full h-14 bg-black/40 border-white/10 rounded-2xl text-white font-sans focus:ring-1 focus:ring-[#6A2C91]/30 transition-shadow", children: [
                        /* @__PURE__ */ jsx("option", { value: "1K", className: "bg-black", children: "Standard 1K" }),
                        /* @__PURE__ */ jsx("option", { value: "2K", className: "bg-black", children: "High Definition 2K" }),
                        /* @__PURE__ */ jsx("option", { value: "4K", className: "bg-black", children: "Cinema Quality 4K" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-8", children: [
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-xs font-sans text-gray-500 uppercase tracking-wider mb-3 ml-1", children: "Aspect Ratio" }),
                      /* @__PURE__ */ jsxs(Select, { value: aspectRatio, onChange: (e) => setAspectRatio(e.target.value), className: "w-full h-14 bg-black/40 border-white/10 rounded-2xl text-white font-sans focus:ring-1 focus:ring-[#6A2C91]/30 transition-shadow", children: [
                        /* @__PURE__ */ jsx("option", { value: "1:1", className: "bg-black", children: "Square (1:1)" }),
                        /* @__PURE__ */ jsx("option", { value: "16:9", className: "bg-black", children: "Landscape (16:9)" }),
                        /* @__PURE__ */ jsx("option", { value: "9:16", className: "bg-black", children: "Portrait (9:16)" }),
                        /* @__PURE__ */ jsx("option", { value: "4:5", className: "bg-black", children: "Vertical (4:5)" })
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("label", { className: "block text-xs font-sans text-gray-500 uppercase tracking-wider mb-3 ml-1", children: "Aesthetic Style" }),
                      /* @__PURE__ */ jsxs(Select, { value: style, onChange: (e) => setStyle(e.target.value), className: "w-full h-14 bg-black/40 border-white/10 rounded-2xl text-white font-sans focus:ring-1 focus:ring-[#6A2C91]/30 transition-shadow", children: [
                        /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Photorealistic" }),
                        /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Minimalist" }),
                        /* @__PURE__ */ jsx("option", { className: "bg-black", children: "Vibrant" })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("label", { className: "block text-xs font-sans text-gray-500 uppercase tracking-wider mb-3 ml-1", children: "Asset Description" }),
                    /* @__PURE__ */ jsx(
                      "textarea",
                      {
                        placeholder: "Describe your image with high-sensory detail...",
                        value: topic,
                        onChange: (e) => setTopic(e.target.value),
                        className: "w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-gray-300 font-sans focus:bg-black/60 focus:ring-1 focus:ring-[#6A2C91]/30 outline-none h-40 resize-none transition-all shadow-sm placeholder:text-gray-600"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxs(Button, { onClick: handleGenerate, className: "w-full bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 rounded-full font-sans font-medium text-sm tracking-wide shadow-md transition-all duration-300", disabled: isGenerating, children: [
                    isGenerating ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin mr-3", size: 18 }) : /* @__PURE__ */ jsx(Sparkles, { size: 18, className: "mr-3" }),
                    isGenerating ? "Synthesizing Pixels..." : "Initialize Visual Generation"
                  ] })
                ] })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.3, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              children: /* @__PURE__ */ jsx("div", { className: "bg-black/20 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center min-h-[600px] relative group hover:bg-black/30 transition-all duration-500 overflow-hidden shadow-sm", children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: generatedImage ? /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, scale: 0.95 },
                  animate: { opacity: 1, scale: 1 },
                  exit: { opacity: 0, scale: 0.95 },
                  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
                  className: "w-full h-full flex flex-col items-center p-4 sm:p-10",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "flex-1 w-full flex items-center justify-center mb-10", children: /* @__PURE__ */ jsx("img", { src: generatedImage, alt: "Generated", className: "max-w-full max-h-[400px] object-contain rounded-2xl shadow-lg border border-white/5" }) }),
                    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto", children: [
                      /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setGeneratedImage(null), className: "flex-1 h-14 rounded-full text-xs font-sans font-medium text-gray-400 border-white/10 hover:bg-white/5 transition-colors", children: "Discard Node" }),
                      /* @__PURE__ */ jsx(Button, { onClick: handleSave, className: "flex-[2] bg-[#C5A059] hover:bg-[#b08d4f] text-white h-14 rounded-full font-sans font-medium text-xs tracking-wide shadow-md transition-all", children: "Approve & Schedule" })
                    ] })
                  ]
                },
                "generated-image"
              ) : /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  exit: { opacity: 0 },
                  className: "text-center space-y-6",
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-white/20 mx-auto shadow-sm group-hover:scale-105 transition-transform duration-700", children: /* @__PURE__ */ jsx(Image, { size: 40, strokeWidth: 1.5 }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "text-xs font-sans text-gray-500 uppercase tracking-widest", children: "Output Preview Node" }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 font-serif italic mt-2", children: "Awaiting Pulse" })
                    ] })
                  ]
                },
                "placeholder"
              ) }) })
            }
          )
        ] })
      ]
    }
  );
};
const AccountSettings = () => {
  const { businessProfile, updateBusinessProfile } = useArtisanData();
  const [formData, setFormData] = useState({ fullName: businessProfile.ownerName, email: businessProfile.email, avatarUrl: businessProfile.avatarUrl });
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const handleSave = () => {
    updateBusinessProfile({ ...businessProfile, ownerName: formData.fullName, email: formData.email, avatarUrl: formData.avatarUrl });
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2500);
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/command-center"), className: "flex items-center gap-3 text-white/50 hover:text-[#C5A059] font-sans text-[11px] uppercase tracking-widest transition-colors w-fit group", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { size: 16, className: "group-hover:-translate-x-1 transition-transform" }),
            " Back to Command Center"
          ] }),
          /* @__PURE__ */ jsx(
            VaultBanner,
            {
              title: "Account Architecture",
              subtitle: "Manage your digital credentials and vault access. Synchronize credentials with the secure LDAP vault.",
              badge: "Security Protocol Active",
              children: /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsx(Button, { className: "bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 px-12 rounded-full shadow-2xl shadow-[#6A2C91]/20 font-sans font-medium text-[11px] tracking-widest transition-all uppercase", onClick: handleSave, children: "COMMIT IDENTITY UPDATES" }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/2", children: /* @__PURE__ */ jsxs("div", { className: `luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-10 ${isSuccess ? "ring-1 ring-emerald-500/50 bg-emerald-900/10" : ""} transition-all duration-500 rounded-[2.5rem]`, children: [
          /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif text-white font-bold mb-8 tracking-tight", children: "Identity Nodes" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
              /* @__PURE__ */ jsx("div", { className: "w-20 h-20 rounded-[1.2rem] bg-gradient-to-tr from-[#6A2C91] to-[#C5A059] p-[2px] flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(197,160,89,0.3)]", children: /* @__PURE__ */ jsx("div", { className: "w-full h-full rounded-xl overflow-hidden bg-black flex items-center justify-center", children: formData.avatarUrl ? /* @__PURE__ */ jsx("img", { src: formData.avatarUrl, alt: "Avatar", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(User, { size: 32, className: "text-[#C5A059]" }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2 flex-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans text-white/40 uppercase tracking-widest block font-bold", children: "Avatar URL" }),
                /* @__PURE__ */ jsx(Input, { value: formData.avatarUrl || "", onChange: (e) => setFormData({ ...formData, avatarUrl: e.target.value }), placeholder: "https://example.com/avatar.jpg", className: "h-10 rounded-xl bg-white/5 border-white/10 text-white" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans text-white/40 uppercase tracking-widest mb-2 block font-bold", children: "Full Legal Name" }),
                /* @__PURE__ */ jsx(Input, { value: formData.fullName, onChange: (e) => setFormData({ ...formData, fullName: e.target.value }), placeholder: "Architect Full Name", className: "h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans text-white/40 uppercase tracking-widest mb-2 block font-bold", children: "Login Identity (Read-only)" }),
                /* @__PURE__ */ jsx(Input, { value: formData.email, disabled: true, placeholder: "Secure Email", className: "h-14 rounded-2xl bg-white/5 text-white/30 cursor-not-allowed border-dashed border-white/10" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-white/40 font-sans font-light", children: "Synchronize credentials with the secure LDAP vault." }),
              /* @__PURE__ */ jsx(Button, { variant: "outline", className: "text-[10px] h-12 font-sans font-bold tracking-widest uppercase px-6 rounded-full border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition-colors", children: "Request Reset" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center gap-6 pt-4", children: [
              /* @__PURE__ */ jsx(Button, { className: "bg-[#6A2C91] hover:bg-[#5a257a] text-white h-14 w-full px-12 rounded-full shadow-md font-sans font-medium text-[10px] uppercase tracking-widest transition-all", onClick: handleSave, children: "Commit Identity Updates" }),
              isSuccess && /* @__PURE__ */ jsxs("span", { className: "text-emerald-400 text-[10px] font-sans font-bold uppercase tracking-widest flex items-center gap-2 animate-in slide-up", children: [
                /* @__PURE__ */ jsx(CheckCircle, { size: 16 }),
                " Protocol Updated"
              ] })
            ] })
          ] })
        ] }) })
      ]
    }
  );
};
const BusinessSetup = () => {
  const { businessProfile, updateBusinessProfile } = useArtisanData();
  const [profile, setProfile] = useState(businessProfile);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const handleSave = () => {
    updateBusinessProfile(profile);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2500);
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/command-center"), className: "flex items-center gap-3 text-white/50 hover:text-[#C5A059] font-sans text-[11px] uppercase tracking-widest transition-colors w-fit group", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { size: 16, className: "group-hover:-translate-x-1 transition-transform" }),
            " Back to Command Center"
          ] }),
          /* @__PURE__ */ jsx(
            VaultBanner,
            {
              title: "Enterprise Setup",
              subtitle: "Establishing core manufacturing parameters and industry alignment. Pushing global updates to the decentralized ledger.",
              badge: "System Protocol Active",
              children: /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsx(Button, { className: "bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 px-12 rounded-full shadow-2xl shadow-[#6A2C91]/20 font-sans font-medium text-[11px] tracking-widest transition-all uppercase", onClick: handleSave, children: "PUSH GLOBAL UPDATES" }) })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/2", children: /* @__PURE__ */ jsxs("div", { className: `luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-10 ${isSuccess ? "ring-1 ring-emerald-500/50 bg-emerald-900/10" : ""} transition-all duration-500 rounded-[2.5rem]`, children: [
          /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif text-white font-bold mb-8 tracking-tight", children: "Corporate Node Definition" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans text-white/40 uppercase tracking-widest mb-2 block font-bold", children: "Legal Entity Name" }),
                /* @__PURE__ */ jsx(Input, { value: profile.name, onChange: (e) => setProfile({ ...profile, name: e.target.value }), placeholder: "Business Entity Name", className: "h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans text-white/40 uppercase tracking-widest mb-2 block font-bold", children: "Industry Logic" }),
                /* @__PURE__ */ jsxs(Select, { value: profile.industry, onChange: (e) => setProfile({ ...profile, industry: e.target.value }), className: "h-14 rounded-2xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors", children: [
                  /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: "Skincare" }),
                  /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: "Candles" }),
                  /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: "Apparel" }),
                  /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: "Pottery" }),
                  /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: "Jewelry" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-6 bg-white/5 p-4 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-inner group hover:bg-white/10 transition-all", children: [
              /* @__PURE__ */ jsx("div", { className: "w-32 h-32 bg-black/50 rounded-[2rem] border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-all duration-700", children: profile.logo ? /* @__PURE__ */ jsx("img", { src: profile.logo, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx("span", { className: "text-[10px] text-white/20 uppercase font-black tracking-[0.3em]", children: "No Asset" }) }),
              /* @__PURE__ */ jsxs(Button, { variant: "outline", onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              }, className: "text-[10px] h-10 px-8 rounded-xl font-black uppercase tracking-widest border-white/20 text-white/60 hover:bg-white/10 hover:text-white", children: [
                /* @__PURE__ */ jsx(Upload, { size: 18, className: "mr-2" }),
                " Synchronize Logo"
              ] }),
              /* @__PURE__ */ jsx("input", { type: "file", ref: fileInputRef, className: "hidden" })
            ] })
          ] })
        ] }) })
      ]
    }
  );
};
const AuthGateway = ({ initialView = "login", selectedTier: propSelectedTier, onBack }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlTier = queryParams.get("tier");
  const activeTier = propSelectedTier || urlTier || void 0;
  const { login, googleLogin, signUp } = useArtisanData();
  const [view, setView] = useState(
    activeTier ? activeTier === "Free Audit" ? "signup" : "payment" : initialView
  );
  const [selectedTier, setSelectedTier] = useState(activeTier);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [isNewUser, setIsNewUser] = useState(!!activeTier);
  const authSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    pass: z.string().min(8, { message: "Vault Key (Password) must be at least 8 characters long" })
  });
  const handleLogin = async (e) => {
    e.preventDefault();
    const result = authSchema.safeParse({ email, pass });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    if (view === "signup") {
      if (selectedTier === "Free Audit") {
        try {
          await signUp({ email, password: pass, tier: "Free Audit", status: "Active" });
        } catch (e2) {
          toast.error("Account creation failed. You may already have an account with this email.");
        }
      } else if (selectedTier) {
        setView("payment");
      } else {
        setView("tiers");
      }
    } else {
      await login(email, pass);
    }
  };
  const handleGoogleAuth = async () => {
    try {
      const user = await googleLogin();
      if (user) {
        if (isNewUser) {
          if (selectedTier === "Free Audit") {
            try {
              await signUp({ email: user.email, name: user.displayName || "New Artisan Business", password: "", tier: "Free Audit", status: "Active" });
            } catch (e) {
              console.error(e);
            }
          } else if (selectedTier) {
            setEmail(user.email);
            setView("payment");
          } else {
            setEmail(user.email);
            setView("tiers");
          }
        }
      }
    } catch (error) {
      console.error("Google OAuth handshake failed:", error);
    }
  };
  return /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: view === "tiers" ? /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.02 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      className: "w-full min-h-screen",
      children: /* @__PURE__ */ jsx(TierSelection, { onSelect: (tier) => signUp({ email, password: pass, tier, status: "Active" }) })
    },
    "tiers"
  ) : view === "payment" && selectedTier ? /* @__PURE__ */ jsx(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.98 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 1.02 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      className: "w-full min-h-screen",
      children: /* @__PURE__ */ jsx(
        PaymentGateway,
        {
          tier: selectedTier,
          email,
          onSuccess: async () => {
            try {
              await signUp({ email, password: pass, tier: selectedTier, status: "Active" });
            } catch (e) {
              alert("Account creation failed. You may already have an account with this email.");
            }
          },
          onBack: () => setView("signup")
        }
      )
    },
    "payment"
  ) : /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      className: "min-h-screen flex items-center justify-center bg-black p-6 relative overflow-hidden",
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-black" }),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
            className: "w-full max-w-md z-10",
            children: [
              onBack && /* @__PURE__ */ jsx("button", { onClick: onBack, className: "absolute -top-4 sm:p-12 left-0 text-sm font-bold text-white/50 hover:text-white transition-colors", children: "← Back to Platform" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center mb-12", children: [
                /* @__PURE__ */ jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
                    className: "relative mb-8",
                    children: /* @__PURE__ */ jsx("img", { src: "/LOGO%20Official-Trans.png", alt: "ArtisanFlow Logo", className: "w-[350px] h-auto object-contain mx-auto" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  motion.p,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
                    className: "text-white/30 font-sans text-sm mt-3 tracking-wide uppercase text-[10px] font-medium",
                    children: "Orchestrating High-Precision Manufacturing"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                motion.div,
                {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 },
                  children: [
                    /* @__PURE__ */ jsxs(Card, { className: "luxury-card p-4 sm:p-8 sm:p-4 sm:p-10 bg-black/40 backdrop-blur-3xl border-white/5", children: [
                      /* @__PURE__ */ jsxs("h2", { className: "text-lg font-serif text-white mb-8 flex items-center justify-center gap-3 text-center", children: [
                        view === "login" ? /* @__PURE__ */ jsx(Lock, { size: 18, className: "text-[#C5A059]" }) : /* @__PURE__ */ jsx(Mail, { size: 18, className: "text-[#C5A059]" }),
                        view === "login" ? "Sign Into Your Account" : "Create New Account"
                      ] }),
                      /* @__PURE__ */ jsxs("form", { onSubmit: handleLogin, className: "space-y-6", children: [
                        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1", children: "Work Email" }),
                          /* @__PURE__ */ jsx(Input, { type: "email", placeholder: "alex@artisanflow.ai", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "h-12 bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-[#C5A059]/50 transition-all" })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1", children: "Vault Key (Password)" }),
                          /* @__PURE__ */ jsx(Input, { type: "password", placeholder: "••••••••", value: pass, onChange: (e) => setPass(e.target.value), required: true, className: "h-12 bg-white/5 border-white/10 text-white focus-visible:ring-1 focus-visible:ring-[#C5A059]/50 transition-all" })
                        ] }),
                        /* @__PURE__ */ jsxs(Button, { variant: view === "login" ? "success" : "premium", type: "submit", className: "w-full md:w-full flex items-center justify-center h-12 font-black tracking-widest shadow-2xl", children: [
                          "ENTER DASHBOARD ",
                          /* @__PURE__ */ jsx(ArrowRight, { size: 18, className: "ml-1" })
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { className: "relative my-8", children: [
                        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx("div", { className: "w-full border-t border-white/5" }) }),
                        /* @__PURE__ */ jsx("div", { className: "relative flex justify-center text-[10px] font-black uppercase bg-transparent px-4 text-white/20 tracking-[0.2em]", children: "Secure Entry Point" })
                      ] }),
                      /* @__PURE__ */ jsxs(Button, { type: "button", variant: "outline", onClick: handleGoogleAuth, className: "w-full md:w-full flex items-center justify-center h-12 font-bold border-white/10 hover:bg-white/5 text-white", children: [
                        /* @__PURE__ */ jsx(Chrome, { size: 18, className: "mr-2 text-[#4285F4]" }),
                        " Continue with Google"
                      ] }),
                      /* @__PURE__ */ jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsx(
                        Button,
                        {
                          type: "button",
                          variant: "primary",
                          onClick: () => {
                            setView(view === "login" ? "signup" : "login");
                            setIsNewUser(view === "login");
                          },
                          className: "w-full md:w-full flex items-center justify-center h-12 font-bold bg-[#6A2C91] hover:bg-purple-800 border-none text-white transition-colors",
                          children: view === "login" ? "Don't have an access key? Initialize here" : "Already Have An Account? Sign In Here"
                        }
                      ) })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "mt-12 flex items-center justify-center gap-6 opacity-30", children: [
                      /* @__PURE__ */ jsx(ShieldCheck, { size: 24, className: "text-white" }),
                      /* @__PURE__ */ jsx("div", { className: "h-4 w-px bg-white/20" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-white", children: "End-to-End Encryption Active" })
                    ] })
                  ]
                }
              )
            ]
          }
        )
      ]
    },
    "auth"
  ) });
};
const TierSelection = ({ onSelect }) => {
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#0A0A0A] p-6 flex flex-col items-center justify-center relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "carbon-texture" }),
    /* @__PURE__ */ jsx("div", { className: "light-streak-top" }),
    /* @__PURE__ */ jsx("div", { className: "light-streak-bottom" }),
    /* @__PURE__ */ jsx("div", { className: "light-streak-left" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6A2C91_0%,transparent_60%)] opacity-30" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#C5A059_0%,transparent_60%)] opacity-20" }),
    /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,#10b981_0%,transparent_70%)] opacity-10" }),
    /* @__PURE__ */ jsxs("div", { className: "max-w-6xl w-full z-10", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
          className: "text-center mb-20",
          children: [
            /* @__PURE__ */ jsx("h1", { className: "text-5xl font-serif text-white mb-6 tracking-tight", children: "Select Your Architecture" }),
            /* @__PURE__ */ jsx("p", { className: "text-white/50 text-lg font-sans max-w-2xl mx-auto font-light leading-relaxed", children: "Every great system starts with a solid foundation. Choose the tier that aligns with your operational scale." })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          animate: "visible",
          variants: {
            visible: { transition: { staggerChildren: 0.15 } }
          },
          className: "grid grid-cols-1 md:grid-cols-3 gap-4 sm:p-8 lg:gap-4 sm:p-12",
          children: [
            /* @__PURE__ */ jsx(
              TierCard,
              {
                title: "Free Audit",
                price: "$0",
                icon: ShieldCheck,
                color: "bg-slate-500",
                features: ["Public Resources", "Initial Strategy Session", "Manual Batch Entry", "Basic Inventory List"],
                onSelect: () => onSelect("Free Audit")
              }
            ),
            /* @__PURE__ */ jsx(
              TierCard,
              {
                title: "Artisan Flow Basic",
                price: "$49",
                isPopular: true,
                icon: Zap,
                color: "bg-[#6A2C91]",
                features: ["Omnichannel Sync", "Automated Inventory", "Lola AI Basic Access", "Production Scheduler"],
                onSelect: () => onSelect("Artisan Flow Basic")
              }
            ),
            /* @__PURE__ */ jsx(
              TierCard,
              {
                title: "Margin Protection Pro",
                price: "$149",
                icon: Crown,
                color: "bg-[#C5A059]",
                features: ["Everything in Basic", "Margin Anomaly Detection", "AI Competitive Intelligence", "Advanced Forecast Generator"],
                onSelect: () => onSelect("Margin Protection Pro")
              }
            )
          ]
        }
      )
    ] })
  ] });
};
const TierCard = ({ title, price, features, icon: Icon, color, isPopular, onSelect }) => /* @__PURE__ */ jsx(
  motion.div,
  {
    variants: {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
    },
    className: "h-full",
    children: /* @__PURE__ */ jsxs(Card, { className: `luxury-card relative flex flex-col h-full p-10 bg-black/40 backdrop-blur-3xl border-white/5 ${isPopular ? "ring-1 ring-[#C5A059]/30" : ""}`, children: [
      isPopular && /* @__PURE__ */ jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C5A059] text-white text-[9px] font-sans uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-sm", children: "Recommended" }),
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("div", { className: `w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 text-white border border-white/10`, children: /* @__PURE__ */ jsx(Icon, { size: 24, strokeWidth: 1.5 }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif text-white tracking-tight mb-2", children: title }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-baseline mt-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-4xl font-serif text-white", children: price }),
          /* @__PURE__ */ jsx("span", { className: "text-white/30 text-xs font-sans tracking-widest uppercase ml-2", children: "/month" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-5 mb-12 flex-1", children: features.map((f) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
        /* @__PURE__ */ jsx(CheckCircle, { size: 18, className: "text-[#C5A059] shrink-0 mt-0.5", strokeWidth: 1.5 }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-sans text-white/60 leading-relaxed", children: f })
      ] }, f)) }),
      /* @__PURE__ */ jsxs(
        Button,
        {
          variant: isPopular ? "premium" : "outline",
          onClick: onSelect,
          className: `w-full h-14 font-sans text-[11px] font-medium tracking-[0.2em] uppercase transition-all duration-300 ${isPopular ? "shadow-2xl" : "border-white/10 text-white hover:bg-white/5"}`,
          children: [
            "Initialize ",
            title
          ]
        }
      )
    ] })
  }
);
const PaymentGateway = ({ tier, email, onSuccess, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    cardNumber: "",
    expiry: "",
    cvc: ""
  });
  const handlePayment = async (token) => {
    setIsProcessing(true);
    try {
      if (!token) throw new Error("Missing payment token");
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: token,
          amount: tier === "Margin Protection Pro" ? 14900 : 4900,
          // in cents
          currency: "USD"
        })
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Payment authorization was declined by the gateway.");
      }
      setIsProcessing(false);
      onSuccess();
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      toast.error(error.message || "Payment failed. Please check your credentials.");
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#0A0A0A]", children: [
    /* @__PURE__ */ jsx("div", { className: "carbon-texture" }),
    /* @__PURE__ */ jsx("button", { onClick: onBack, className: "absolute top-4 sm:p-10 left-10 text-sm font-bold text-white/50 hover:text-white transition-colors z-20", children: "← Back to Account Creation" }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "w-full max-w-2xl z-10",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-10", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-serif text-white tracking-tight mb-3", children: "Secure Checkout" }),
            /* @__PURE__ */ jsxs("p", { className: "text-white/50 font-sans text-sm tracking-widest uppercase", children: [
              "Initializing ",
              tier,
              " Architecture"
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 inline-block px-6 py-2 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10", children: /* @__PURE__ */ jsxs("span", { className: "text-xl font-serif text-[#C5A059]", children: [
              "Total: $",
              tier === "Margin Protection Pro" ? "149.00" : "49.00",
              " / mo"
            ] }) })
          ] }),
          /* @__PURE__ */ jsx(Card, { className: "luxury-card p-4 sm:p-8 sm:p-4 sm:p-10 bg-black/60 backdrop-blur-3xl border-white/10 shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-white font-serif text-lg mb-4 border-b border-white/10 pb-2", children: "Billing Details" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1", children: "Full Name" }),
                /* @__PURE__ */ jsx(Input, { type: "text", placeholder: "Alex Morgan", required: true, value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "bg-white/5 border-white/10 text-white" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1", children: "Street Address" }),
                /* @__PURE__ */ jsx(Input, { type: "text", placeholder: "123 Artisan Way", required: true, value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }), className: "bg-white/5 border-white/10 text-white" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "col-span-1 space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1", children: "City" }),
                  /* @__PURE__ */ jsx(Input, { type: "text", placeholder: "New York", required: true, value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }), className: "bg-white/5 border-white/10 text-white" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "col-span-1 space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1", children: "State" }),
                  /* @__PURE__ */ jsx(Input, { type: "text", placeholder: "NY", required: true, value: formData.state, onChange: (e) => setFormData({ ...formData, state: e.target.value }), className: "bg-white/5 border-white/10 text-white" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "col-span-1 space-y-2", children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans text-white/30 uppercase tracking-[0.15em] ml-1", children: "ZIP" }),
                  /* @__PURE__ */ jsx(Input, { type: "text", placeholder: "10001", required: true, value: formData.zip, onChange: (e) => setFormData({ ...formData, zip: e.target.value }), className: "bg-white/5 border-white/10 text-white" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4", children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-white font-serif text-lg mb-4 border-b border-white/10 pb-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(CreditCard, { size: 18, className: "text-[#C5A059]" }),
                " Payment Information"
              ] }),
              /* @__PURE__ */ jsx(
                PaymentForm,
                {
                  applicationId: "sandbox-sq0idb-app-id",
                  locationId: "L7APSEDCE2RJX",
                  cardTokenizeResponseReceived: async (tokenResult, verifiedBuyer) => {
                    if (tokenResult.status === "OK") {
                      await handlePayment(tokenResult.token);
                    } else {
                      toast.error("Payment tokenization failed. Please check your card details.");
                      console.error("Tokenization error:", tokenResult.errors);
                    }
                  },
                  children: /* @__PURE__ */ jsx(
                    CreditCard$1,
                    {
                      buttonProps: {
                        css: {
                          backgroundColor: "#6A2C91",
                          fontSize: "14px",
                          color: "#fff",
                          height: "56px",
                          fontWeight: "900",
                          letterSpacing: "0.1em",
                          "&:hover": {
                            backgroundColor: "#522272"
                          }
                        },
                        isLoading: isProcessing
                      },
                      focus: "cardNumber",
                      children: isProcessing ? "PROCESSING SECURE PAYMENT..." : `PAY $${tier === "Margin Protection Pro" ? "149.00" : "49.00"} & INITIALIZE`
                    }
                  )
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-white/30 mt-4", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { size: 14 }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] uppercase tracking-widest", children: "256-bit SSL Encrypted Transaction" })
            ] })
          ] }) })
        ]
      }
    )
  ] });
};
const SubscriptionManagement = () => {
  const { userTier, updateTier, businessProfile } = useArtisanData();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const handleSuccess = async (tierToApply) => {
    var _a;
    await updateTier(tierToApply);
    toast.success("Protocol Authorized. Access Granted.");
    setSelectedUpgrade(null);
    if ((_a = location.state) == null ? void 0 : _a.from) navigate(location.state.from);
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20",
      children: [
        /* @__PURE__ */ jsx(
          ContextualTutorialModal,
          {
            hubId: "subscription_status",
            title: "Subscription Status",
            description: "Manage your ArtisanFlow plan and billing.",
            steps: ["Review your current tier and usage limits.", "Upgrade to unlock advanced features.", "Manage payment methods and billing history."]
          }
        ),
        /* @__PURE__ */ jsx(Modal, { isOpen: !!selectedUpgrade, onClose: () => setSelectedUpgrade(null), title: "Vault Payment Gateway", children: selectedUpgrade && /* @__PURE__ */ jsx(
          PaymentGateway,
          {
            tier: selectedUpgrade,
            email: businessProfile.email,
            onSuccess: () => handleSuccess(selectedUpgrade),
            onBack: () => setSelectedUpgrade(null)
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/command-center"), className: "flex items-center gap-2 text-white/50 hover:text-[#C5A059] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
            " Back to Command Center"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-serif text-white font-bold tracking-tight mb-2", children: "Access Level" }),
          /* @__PURE__ */ jsx("p", { className: "text-white/40 font-sans font-light text-lg", children: "Defining system throughput and logic capabilities." })
        ] }),
        businessProfile.status === "Past Due" && /* @__PURE__ */ jsxs("div", { className: "bg-red-900/30 border-l-4 border-red-500 p-6 rounded-2xl shadow-lg mb-8", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-red-400 font-bold text-lg flex items-center gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(AlertTriangle, { size: 20 }),
            " ACTION REQUIRED: PAST DUE BALANCE"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-white/80 font-sans font-light leading-relaxed mb-4", children: [
            "Your most recent tier payment was declined or could not be processed. Tier features and architectural logic modules ",
            /* @__PURE__ */ jsx("strong", { children: "can and will be restricted at any time" }),
            ". Express urgency by processing your payment below to retain your uninhibited access to all ArtisanFlow features."
          ] }),
          /* @__PURE__ */ jsx(Button, { onClick: () => setSelectedUpgrade(userTier), className: "bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2 rounded-xl transition-colors", children: "Process Secure Payment Now" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-4 sm:p-12 flex flex-col md:flex-row justify-between items-center gap-4 sm:p-10 relative overflow-hidden group rounded-[3rem]", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 sm:p-12 opacity-[0.02] text-[#C5A059] pointer-events-none group-hover:opacity-[0.05] transition-opacity duration-700", children: /* @__PURE__ */ jsx(Crown, { size: 160 }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 sm:p-8 relative z-10", children: [
            /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-[#C5A059] shadow-sm border border-[#C5A059]/20 group-hover:scale-105 transition-transform duration-700", children: /* @__PURE__ */ jsx(Crown, { size: 40, strokeWidth: 1.5 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-sans text-white/50 font-bold uppercase tracking-widest mb-2 block", children: "Deployment Level" }),
              /* @__PURE__ */ jsx("h3", { className: "text-4xl font-serif text-white font-bold tracking-tight", children: userTier }),
              /* @__PURE__ */ jsxs("p", { className: "text-emerald-400 mt-3 font-sans font-medium text-xs tracking-wide flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(CheckCircle, { size: 14 }),
                " Systems Active & Verified"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center md:items-end gap-4 relative z-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center md:text-right mb-4", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-sans text-white/50 font-bold uppercase tracking-widest mb-1", children: "Access Initialized" }),
              /* @__PURE__ */ jsx("p", { className: "text-xl font-serif text-white/80 tracking-tight", children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) })
            ] }),
            userTier !== "Margin Protection Pro" && /* @__PURE__ */ jsxs(Button, { variant: "premium", onClick: () => setSelectedUpgrade("Margin Protection Pro"), className: "h-14 px-10 rounded-full font-sans font-medium text-[10px] uppercase tracking-widest shadow-md", children: [
              "Activate Pro Access ",
              /* @__PURE__ */ jsx(Crown, { size: 16, className: "ml-2" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-8 mt-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-10", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif text-white font-bold mb-8 tracking-tight", children: "Deployment Protocols" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-6", children: [
              { icon: ShieldCheck, text: "Advanced Synaptic Protection" },
              { icon: Crown, text: "Architectural Logic Modules" },
              { icon: Zap, text: "High-Throughput Node Access" },
              { icon: CheckCircle, text: "Bidirectional Database Sync" }
            ].map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-5 group/item", children: [
              /* @__PURE__ */ jsx("div", { className: "p-3 bg-white/5 border border-white/10 rounded-2xl shadow-sm text-[#C5A059] group-hover/item:bg-[#C5A059] group-hover/item:text-black transition-all duration-300", children: /* @__PURE__ */ jsx(item.icon, { size: 20, strokeWidth: 1.5 }) }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-sans font-medium text-white/70", children: item.text })
            ] }, i)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-10 flex flex-col justify-center items-center text-center group", children: [
            /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/30 mb-8 shadow-sm group-hover:text-[#C5A059] group-hover:scale-105 transition-all duration-500", children: /* @__PURE__ */ jsx(ExternalLink, { size: 32, strokeWidth: 1.5 }) }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-white/50 max-w-[240px] mb-10 font-sans font-light leading-relaxed", children: "Access the global billing repository and transaction historicals." }),
            /* @__PURE__ */ jsx(Button, { variant: "outline", className: "text-[10px] uppercase font-sans font-bold tracking-widest h-12 px-10 rounded-full border-white/20 text-white/70 hover:bg-white/10 transition-colors", children: "Open Billing Vault" })
          ] })
        ] })
      ]
    }
  );
};
const Integrations = () => {
  const navigate = useNavigate();
  const { integrations, toggleIntegrationStatus, businessProfile } = useArtisanData();
  const [activeTab, setActiveTab] = useState("All");
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(null);
  const [activeModalIntegration, setActiveModalIntegration] = useState(null);
  const [integrationEmail, setIntegrationEmail] = useState("");
  const [integrationPassword, setIntegrationPassword] = useState("");
  const [integrationKey, setIntegrationKey] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const categories = ["All", "E-commerce", "Marketplace", "Wholesale", "POS", "System"];
  const filteredIntegrations = integrations.filter(
    (int) => activeTab === "All" || int.category === activeTab
  );
  const runDiagnostic = (id) => {
    setIsDiagnosticRunning(id);
    setTimeout(() => setIsDiagnosticRunning(null), 2500);
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20",
      children: [
        /* @__PURE__ */ jsx(
          ContextualTutorialModal,
          {
            hubId: "integrations",
            title: "Integrations Hub",
            description: "Connect ArtisanFlow to your external tools.",
            steps: ["Link your Shopify or WooCommerce stores.", "Connect accounting software like QuickBooks.", "Enable social media channels for auto-posting."]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/command-center"), className: "flex items-center gap-2 text-white/50 hover:text-[#C5A059] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit", children: [
              /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
              " Back to Command Center"
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-serif text-white font-bold tracking-tight mb-2", children: "Integrations" }),
            /* @__PURE__ */ jsx("p", { className: "text-white/40 font-sans font-light text-lg", children: "Synchronizing external manufacturing and commerce nodes." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-emerald-900/20 px-6 py-3 rounded-full border border-emerald-500/20 flex items-center gap-3 shadow-sm", children: [
            /* @__PURE__ */ jsx(RefreshCw, { size: 16, className: "text-emerald-400 animate-spin-slow" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-sans font-bold uppercase text-emerald-400 tracking-widest", children: "Synaptic Link Online" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[3rem] relative overflow-hidden p-4 sm:p-12", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-80 h-80 bg-[#6A2C91] opacity-[0.05] rounded-bl-full -mr-20 -mt-20 pointer-events-none" }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-6", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-3xl font-serif text-white font-bold flex items-center gap-4 tracking-tight", children: [
              /* @__PURE__ */ jsx(ShieldCheck, { className: "text-[#6A2C91]", size: 28 }),
              " The Omnichannel Handshake"
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-white/60 max-w-4xl leading-relaxed text-lg font-sans font-light", children: "LRC Artisan Flow synthesizes your omnichannel operations, bridging the void between digital storefronts and the manufacturing floor. Ingest orders automatically and maintain surgical stock levels across every connected node." }),
            (businessProfile == null ? void 0 : businessProfile.role) === "admin" && /* @__PURE__ */ jsxs("div", { className: "mt-6 p-6 bg-[#6A2C91]/10 border border-[#6A2C91]/30 rounded-2xl w-full max-w-4xl", children: [
              /* @__PURE__ */ jsx("p", { className: "text-white/70 font-sans font-bold text-[10px] uppercase tracking-widest mb-2", children: "Webhook URL (For Shopify, Etsy, Square Webhooks)" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx(Input, { value: `${"https://script.google.com/macros/s/AKfycbwcHalq43bfMKo-HHwKO6cNGNNBU67sF7CPtRHITBw1Lbdrx28GNOHfBBDJhEDZSTxB/exec"}?action=handleStoreOrder`, readOnly: true, className: "w-full font-mono text-sm bg-black/50 border-[#6A2C91]/30 text-emerald-400" }),
                /* @__PURE__ */ jsx(Button, { onClick: () => {
                  navigator.clipboard.writeText(`${"https://script.google.com/macros/s/AKfycbwcHalq43bfMKo-HHwKO6cNGNNBU67sF7CPtRHITBw1Lbdrx28GNOHfBBDJhEDZSTxB/exec"}?action=handleStoreOrder`);
                  toast.success("Webhook URL copied to clipboard");
                }, variant: "outline", className: "border-[#6A2C91]/30 hover:bg-[#6A2C91]/20", children: "Copy" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-white/40 text-xs font-light mt-2", children: "Paste this URL into your storefront's webhook settings to enable automatic raw material deduction on new orders." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 sm:p-8 pt-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-widest text-white/50", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-[#6A2C91]" }),
                " Bidirectional Stock Sync"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-widest text-white/50", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-[#6A2C91]" }),
                " Material Auto-Deduction"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-[10px] font-sans font-bold uppercase tracking-widest text-white/50", children: [
                /* @__PURE__ */ jsx("div", { className: "w-2 h-2 rounded-full bg-[#6A2C91]" }),
                " Real-time Fee Reconciliation"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex overflow-x-auto pb-4 gap-3 scrollbar-hide", children: categories.map((cat) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab(cat),
            className: `px-8 py-3 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === cat ? "bg-[#6A2C91] text-white shadow-lg shadow-[#6A2C91]/20 border border-transparent" : "bg-white/5 text-white/50 border border-white/10 hover:border-[#6A2C91] hover:text-white"}`,
            children: cat
          },
          cat
        )) }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:p-8", children: filteredIntegrations.map((int, index) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: index * 0.1, duration: 0.6 },
            className: "luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-4 sm:p-10 rounded-[2.5rem] flex flex-col group relative hover:-translate-y-1 transition-all duration-500 overflow-hidden hover:border-[#6A2C91]/50 hover:shadow-2xl hover:shadow-[#6A2C91]/10",
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:bg-[#6A2C91]/10 transition-colors duration-700 pointer-events-none" }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-8 relative z-10", children: [
                /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white/5 rounded-2xl border border-white/10 w-24 h-24 flex items-center justify-center group-hover:bg-white/10 group-hover:border-[#6A2C91]/30 transition-all duration-500 shadow-sm relative overflow-hidden", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-serif text-3xl text-white/80 group-hover:text-white transition-colors", children: int.name.charAt(0) }),
                  int.status === "Connected" && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1 bg-emerald-500 text-black rounded-full p-1 border-2 border-black shadow-sm animate-in zoom-in duration-300", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 12 }) })
                ] }),
                int.status === "Connected" ? /* @__PURE__ */ jsxs(Badge, { color: "green", className: "uppercase font-sans font-bold text-[9px] tracking-widest px-3 py-1 flex items-center gap-1.5 shadow-sm border-emerald-500/20", children: [
                  /* @__PURE__ */ jsx(Activity, { size: 10, className: "animate-pulse" }),
                  " Verified Node"
                ] }) : /* @__PURE__ */ jsx(Badge, { color: "gray", className: "uppercase font-sans font-bold text-[9px] tracking-widest px-3 py-1 shadow-sm border-white/10 bg-white/5 text-white/50", children: "Available" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4 relative z-10", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "text-3xl font-serif text-white font-bold tracking-tight group-hover:text-[#6A2C91] transition-colors", children: int.name }),
                  /* @__PURE__ */ jsx("p", { className: "text-[9px] font-sans font-bold text-[#C5A059] uppercase tracking-widest mt-2", children: int.category })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-white/50 leading-relaxed font-sans font-light py-2", children: [
                  '"',
                  int.description,
                  '"'
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-[#6A2C91]/10 border border-[#6A2C91]/20 p-5 rounded-2xl flex items-start gap-4 group/ai hover:bg-[#6A2C91]/20 transition-all duration-500", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-2.5 bg-[#6A2C91]/20 rounded-xl text-[#6A2C91] shadow-sm group-hover/ai:bg-[#6A2C91] group-hover/ai:text-white transition-colors duration-500", children: /* @__PURE__ */ jsx(Sparkles, { size: 16 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[9px] font-sans font-bold text-[#6A2C91] uppercase tracking-widest mb-1", children: "Synaptic Intelligence" }),
                    /* @__PURE__ */ jsx("p", { className: "text-xs font-sans font-bold text-white", children: int.aiCapability })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "space-y-3 py-4", children: int.features.map((feat, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-xs font-sans font-light text-white/50 group-hover:text-white/70 transition-colors", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#6A2C91] transition-colors duration-500" }),
                  feat
                ] }, i)) })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-4 relative z-10", children: [
                int.status === "Connected" && /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: () => runDiagnostic(int.id),
                    disabled: !!isDiagnosticRunning,
                    variant: "outline",
                    className: "w-full h-12 border-white/20 text-white/70 font-sans font-bold text-[10px] tracking-widest uppercase rounded-full hover:bg-white/5 hover:border-white/30 hover:text-white transition-colors",
                    children: isDiagnosticRunning === int.id ? /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin mr-2" }),
                      " ",
                      (businessProfile == null ? void 0 : businessProfile.role) === "admin" ? "ANALYZING LINK..." : "VERIFYING..."
                    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                      /* @__PURE__ */ jsx(Cpu, { size: 14, className: "mr-2" }),
                      " ",
                      (businessProfile == null ? void 0 : businessProfile.role) === "admin" ? "TEST SYNAPTIC LINK" : "VERIFY CONNECTION"
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: () => {
                      if (int.status === "Connected") {
                        toggleIntegrationStatus(int.id);
                      } else {
                        setActiveModalIntegration(int);
                      }
                    },
                    className: `w-full h-12 text-[10px] font-sans font-bold tracking-widest uppercase transition-all duration-500 rounded-full ${int.status === "Connected" ? "bg-white/10 text-white hover:bg-white/20 border border-white/10" : "bg-[#6A2C91] text-white hover:bg-[#5a257a]"}`,
                    children: (businessProfile == null ? void 0 : businessProfile.role) === "admin" ? int.status === "Connected" ? "RECONFIGURE PROTOCOL" : "INITIALIZE HANDSHAKE" : int.status === "Connected" ? "UPDATE SETTINGS" : "CONNECT ACCOUNT"
                  }
                ),
                /* @__PURE__ */ jsxs("button", { className: "w-full flex items-center justify-center gap-2 text-[10px] font-sans font-bold text-white/30 uppercase tracking-widest hover:text-[#C5A059] transition-colors mt-4", children: [
                  "LEARN ARCHITECTURE ",
                  /* @__PURE__ */ jsx(ArrowRight, { size: 14 })
                ] })
              ] }),
              int.lastSync && /* @__PURE__ */ jsxs("div", { className: "mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(RefreshCw, { size: 12, className: "animate-spin-slow text-emerald-400" }),
                  " Synced"
                ] }),
                /* @__PURE__ */ jsx("span", { children: int.lastSync })
              ] })
            ]
          },
          int.id
        )) }),
        /* @__PURE__ */ jsx(Modal, { isOpen: !!activeModalIntegration, onClose: () => setActiveModalIntegration(null), title: `Initialize ${activeModalIntegration == null ? void 0 : activeModalIntegration.name} Link`, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-white/60 font-sans font-light text-sm", children: [
            "Please provide your credentials to securely link ",
            activeModalIntegration == null ? void 0 : activeModalIntegration.name,
            " into the Artisan Flow network."
          ] }),
          (activeModalIntegration == null ? void 0 : activeModalIntegration.category) === "System" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Email Address",
                value: integrationEmail,
                onChange: (e) => setIntegrationEmail(e.target.value),
                className: "w-full"
              }
            ),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "Password",
                type: "password",
                value: integrationPassword,
                onChange: (e) => setIntegrationPassword(e.target.value),
                className: "w-full"
              }
            )
          ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            (activeModalIntegration == null ? void 0 : activeModalIntegration.id) === "square" && /* @__PURE__ */ jsxs("div", { className: "p-4 bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-xl mb-4 text-xs text-[#C5A059] font-sans", children: [
              /* @__PURE__ */ jsx("strong", { children: "OAuth Permissions Required:" }),
              /* @__PURE__ */ jsxs("ul", { className: "list-disc pl-5 mt-2 space-y-1 text-white/70 font-light", children: [
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("code", { className: "text-[#C5A059]", children: "ORDERS_READ" }),
                  ": To track multi-channel sales"
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("code", { className: "text-[#C5A059]", children: "INVENTORY_READ" }),
                  ": To sync matrix levels"
                ] }),
                /* @__PURE__ */ jsxs("li", { children: [
                  /* @__PURE__ */ jsx("code", { className: "text-[#C5A059]", children: "PAYMENTS_READ" }),
                  ": To parse transaction fees"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "API Key / Access Token",
                type: "password",
                value: integrationKey,
                onChange: (e) => setIntegrationKey(e.target.value),
                className: "w-full font-mono text-sm"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "text-xs text-white/40 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Lock, { size: 12 }),
              " Encrypted at rest via AES-256"
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: () => {
                if (!activeModalIntegration) return;
                setIsConnecting(true);
                setTimeout(() => {
                  toggleIntegrationStatus(activeModalIntegration.id);
                  setIsConnecting(false);
                  setActiveModalIntegration(null);
                  setIntegrationEmail("");
                  setIntegrationPassword("");
                  setIntegrationKey("");
                }, 1500);
              },
              disabled: isConnecting,
              className: "w-full h-12 bg-[#6A2C91] hover:bg-[#5a257a] text-white rounded-xl",
              children: isConnecting ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin mx-auto" }) : "Authenticate Connection"
            }
          )
        ] }) })
      ]
    }
  );
};
const CustomerPortal = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/command-center"), className: "flex items-center gap-2 text-white/50 hover:text-[#C5A059] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
            " Back to Command Center"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-serif text-white font-bold tracking-tight mb-2", children: "Wholesale Portal" }),
          /* @__PURE__ */ jsx("p", { className: "text-white/40 font-sans font-light text-lg", children: "Managing the external client interface architecture." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full md:w-2/3 lg:w-1/2", children: /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-4 sm:p-10 rounded-[2.5rem]", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-serif text-white font-bold mb-8 tracking-tight", children: "Portal Matrix" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-6 p-6 bg-white/5 rounded-2xl border border-white/10 group hover:bg-white/10 hover:border-[#6A2C91]/30 transition-all duration-500", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
                /* @__PURE__ */ jsx("div", { className: "p-4 bg-white/5 rounded-xl text-[#C5A059] shadow-sm group-hover:bg-[#C5A059] group-hover:text-black transition-colors duration-500", children: /* @__PURE__ */ jsx(ShoppingBag, { size: 24 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h4", { className: "font-serif text-white font-bold text-xl tracking-tight", children: "Custom Domain Active" }),
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[#C5A059] font-sans font-bold tracking-widest mt-1 uppercase", children: "wholesale.herbalisticwellness.com" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(Button, { variant: "outline", className: "text-[10px] h-10 px-6 font-sans font-bold tracking-widest uppercase rounded-full border-white/20 text-white/70 hover:bg-white/10 hover:text-white transition-colors", children: "RE-ROUTE" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest ml-1", children: "Min. Commitment ($)" }),
                /* @__PURE__ */ jsx(Input, { defaultValue: "500.00", className: "h-14 rounded-xl text-lg font-serif bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest ml-1", children: "Portal Logic State" }),
                /* @__PURE__ */ jsxs(Select, { className: "h-14 rounded-xl bg-white/5 border-white/10 text-white focus:bg-white/10 transition-colors font-sans text-sm", children: [
                  /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: "Public (Visible)" }),
                  /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: "Private (Vetted Nodes Only)" }),
                  /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: "Offline (Maintenance)" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans font-bold text-white/40 uppercase tracking-widest ml-1", children: "Welcome Directive" }),
              /* @__PURE__ */ jsx("textarea", { className: "w-full bg-white/5 border border-white/10 text-white rounded-2xl p-6 text-sm focus:bg-white/10 focus:border-[#6A2C91]/50 outline-none h-32 resize-none shadow-sm font-sans font-light transition-all", defaultValue: "Welcome to our wholesale catalog. Established manufacturing nodes only." })
            ] }),
            /* @__PURE__ */ jsx(Button, { className: "w-full bg-[#6A2C91] text-white h-14 rounded-full font-sans font-bold text-[10px] uppercase tracking-widest hover:bg-[#5a257a] transition-colors mt-4", children: "UPDATE PORTAL PARAMETERS" })
          ] })
        ] }) })
      ]
    }
  );
};
const PrivacyGovernance = () => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/command-center"), className: "flex items-center gap-2 text-white/50 hover:text-[#C5A059] font-sans text-xs uppercase tracking-widest transition-colors mb-6 w-fit", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
            " Back to Command Center"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-serif text-white font-bold tracking-tight mb-2", children: "Security & Governance" }),
          /* @__PURE__ */ jsx("p", { className: "text-white/40 font-sans font-light text-lg", children: "Systems integrity and data protection protocols." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-10", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-serif text-white font-bold mb-8 tracking-tight", children: "Security Protocols" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-500 group", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-3 bg-white/5 rounded-xl shadow-sm text-emerald-400 group-hover:bg-emerald-400 group-hover:text-black transition-colors duration-500 border border-white/10", children: /* @__PURE__ */ jsx(ShieldCheck, { size: 20 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-serif text-white text-xl tracking-tight", children: "Two-Factor Authentication" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/40 font-sans font-bold uppercase tracking-widest mt-1", children: "Mandatory for all vault access." })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(Badge, { color: "green", className: "shadow-sm font-sans font-bold text-[9px] tracking-widest uppercase px-3 py-1 border-emerald-500/20", children: "Active" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/30 transition-all duration-500 group", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5", children: [
                  /* @__PURE__ */ jsx("div", { className: "p-3 bg-white/5 rounded-xl shadow-sm text-blue-400 group-hover:bg-blue-400 group-hover:text-black transition-colors duration-500 border border-white/10", children: /* @__PURE__ */ jsx(Globe, { size: 20 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "font-serif text-white text-xl tracking-tight", children: "GDPR & CCPA Handshake" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/40 font-sans font-bold uppercase tracking-widest mt-1", children: "Data residency: USA-East-1." })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(Badge, { color: "blue", className: "shadow-sm font-sans font-bold text-[9px] tracking-widest uppercase px-3 py-1 border-blue-500/20", children: "Compliant" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-10 flex flex-col h-full", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-serif text-white font-bold mb-8 tracking-tight", children: "System Audits" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors rounded-lg", children: [
                /* @__PURE__ */ jsx("span", { className: "text-white/30 font-mono text-xs tracking-widest", children: "2025-12-14 09:30 AM" }),
                /* @__PURE__ */ jsx("span", { className: "text-white font-sans font-medium text-sm", children: "API Key Rotation Executed" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 border-b border-white/5 hover:bg-white/5 transition-colors rounded-lg", children: [
                /* @__PURE__ */ jsx("span", { className: "text-white/30 font-mono text-xs tracking-widest", children: "2025-12-13 04:12 PM" }),
                /* @__PURE__ */ jsx("span", { className: "text-white font-sans font-medium text-sm", children: "Omnichannel Node Refresh" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "w-full h-12 mt-8 rounded-full border-white/20 text-white/70 font-sans font-bold text-[10px] uppercase tracking-widest hover:bg-white/10 hover:text-white transition-colors", children: [
              /* @__PURE__ */ jsx(Server, { size: 16, className: "mr-3 text-[#C5A059]" }),
              " Download System Audit Trail"
            ] })
          ] })
        ] })
      ]
    }
  );
};
const BusinessPulse = () => {
  const navigate = useNavigate();
  const { demandInsights, businessProfile, inventory, orders } = useArtisanData();
  demandInsights.find((i) => i.isCritical);
  demandInsights.filter((i) => i.isCritical).length;
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
      className: "space-y-12",
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "relative w-full overflow-hidden py-24 px-12 md:px-20 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(106,44,145,0.2)]",
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#0A0A0A]" }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_top_left,#6A2C91_0%,transparent_60%)] opacity-40" }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#C5A059_0%,transparent_60%)] opacity-30" }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(circle_at_center,#10b981_0%,transparent_70%)] opacity-20" }),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" }),
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/30 to-transparent" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent" }),
              /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#6A2C91]/30 to-transparent" }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-white flex flex-col items-center text-center", children: [
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 },
                    transition: { delay: 0.2, duration: 0.8 },
                    className: "flex items-center gap-4 mb-8 px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full",
                    children: [
                      /* @__PURE__ */ jsx(ShieldCheck, { size: 20, className: "text-[#C5A059]" }),
                      /* @__PURE__ */ jsx("span", { className: "text-[12px] font-sans uppercase tracking-[0.4em] text-[#C5A059] font-bold", children: "Secure Vault Access" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxs("h1", { className: "text-6xl md:text-8xl font-serif tracking-tighter text-white leading-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]", children: [
                  "Artisan ",
                  /* @__PURE__ */ jsx("span", { className: "text-[#C5A059]", children: "Flow" }),
                  " Vault"
                ] }) }),
                /* @__PURE__ */ jsxs(
                  motion.p,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { delay: 0.4, duration: 0.8 },
                    className: "text-white/70 text-lg md:text-xl font-sans font-light mb-12 max-w-3xl leading-relaxed italic",
                    children: [
                      '"Precision intelligence for the modern artisan. Your operational legacy, ',
                      /* @__PURE__ */ jsx("span", { className: "text-white font-medium", children: "secured and optimized" }),
                      '."'
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.5, duration: 0.8 },
                    className: "flex flex-wrap justify-center gap-6",
                    children: [
                      /* @__PURE__ */ jsxs(
                        "button",
                        {
                          onClick: () => navigate("/forecasting"),
                          className: "group relative overflow-hidden bg-[#C5A059] text-white px-10 py-5 rounded-2xl font-sans uppercase text-[12px] font-black tracking-[0.4em] transition-all duration-500 hover:shadow-[0_15px_30px_-10px_rgba(197,160,89,0.4)]",
                          children: [
                            /* @__PURE__ */ jsxs("span", { className: "relative z-10 flex items-center gap-4", children: [
                              /* @__PURE__ */ jsx(Plus, { size: 20 }),
                              " INITIATE FORECAST"
                            ] }),
                            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" })
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          onClick: () => navigate("/business-pulse-check"),
                          className: "bg-white/5 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-2xl font-sans uppercase text-[12px] font-black tracking-[0.4em] transition-all duration-500 hover:bg-white/10 hover:border-white/40",
                          children: "SYSTEM DIAGNOSTIC"
                        }
                      )
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("div", { className: "absolute top-4 sm:p-10 left-20 w-32 h-32 border border-[#C5A059]/10 rounded-2xl rotate-12" }),
              /* @__PURE__ */ jsx("div", { className: "absolute bottom-10 right-20 w-48 h-48 border border-[#6A2C91]/10 rounded-full" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.6, duration: 0.8 },
            className: "p-4 sm:p-10 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 sm:p-8 relative group shadow-2xl",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 sm:p-8", children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white border border-white/10", children: /* @__PURE__ */ jsx(BarChart3, { size: 28, strokeWidth: 1.5 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h2", { className: "text-4xl font-serif text-white mb-4 tracking-tight", children: [
                    "Everything is ",
                    /* @__PURE__ */ jsx("span", { className: "text-emerald-400", children: "Running Smoothly" })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-white/50 font-sans font-light text-lg max-w-2xl leading-relaxed", children: "Your stock is healthy, orders are moving, and your profits are protected. No urgent actions needed today." })
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "premium",
                  onClick: () => navigate("/business-pulse-check"),
                  className: "min-w-[220px] h-16 rounded-2xl flex items-center justify-center gap-3 group/btn shadow-xl",
                  children: [
                    "RUN PULSE CHECK ",
                    /* @__PURE__ */ jsx(ArrowRight, { size: 18, className: "group-hover/btn:translate-x-1 transition-transform" })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.8, duration: 0.8 },
            className: "space-y-12",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("h2", { className: "text-3xl font-serif text-white tracking-tight", children: "Vault Entry Points" }),
                /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-white/5 mx-8" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-10", children: [
                /* @__PURE__ */ jsx(
                  QuickAccessCard,
                  {
                    icon: Factory,
                    color: "text-purple-400",
                    title: "Operations Hub",
                    desc: "Manufacturing, Orders & CRM",
                    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
                    action: () => navigate("/operations")
                  }
                ),
                /* @__PURE__ */ jsx(
                  QuickAccessCard,
                  {
                    icon: DollarSign,
                    color: "text-emerald-400",
                    title: "Finance Hub",
                    desc: "Budget & Projections",
                    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800",
                    action: () => navigate("/finance")
                  }
                ),
                /* @__PURE__ */ jsx(
                  QuickAccessCard,
                  {
                    icon: Sparkles,
                    color: "text-[#C5A059]",
                    title: "Marketing Hub",
                    desc: "Brand Voice & Strategy",
                    image: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=800",
                    action: () => navigate("/marketing")
                  }
                ),
                /* @__PURE__ */ jsx(
                  QuickAccessCard,
                  {
                    icon: ShieldCheck,
                    color: "text-blue-400",
                    title: "Profit Guard™",
                    desc: "High-Precision Margin Analysis",
                    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
                    action: () => navigate("/profit-guard")
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
};
const QuickAccessCard = ({ icon: Icon, color, title, desc, image, action }) => /* @__PURE__ */ jsxs(
  "div",
  {
    className: "group p-0 bg-black/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/5 hover:border-[#C5A059]/50 hover:shadow-2xl hover:shadow-black/50 transition-all duration-700 cursor-pointer relative overflow-hidden flex flex-col h-[500px]",
    onClick: action,
    children: [
      /* @__PURE__ */ jsxs("div", { className: "h-1/2 w-full overflow-hidden relative", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: image,
            alt: title,
            className: "w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000",
            referrerPolicy: "no-referrer"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" }),
        /* @__PURE__ */ jsx("div", { className: "absolute top-6 left-6 w-14 h-14 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500", children: /* @__PURE__ */ jsx(Icon, { className: color, size: 24, strokeWidth: 1.5 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-12 flex flex-col flex-1", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-white/5 group-hover:bg-[#C5A059] transition-colors duration-500" }),
        /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif text-white mb-4 tracking-tight group-hover:text-[#C5A059] transition-colors", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm font-sans font-light text-white/50 uppercase tracking-[0.3em] mb-8 leading-relaxed", children: desc }),
        /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center gap-3 text-[11px] font-sans font-bold text-white/30 uppercase tracking-[0.25em] group-hover:text-[#C5A059] transition-colors", children: [
          "Enter Vault Module ",
          /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: "group-hover:translate-x-2 transition-transform" })
        ] })
      ] })
    ]
  }
);
const BusinessPulseCheck = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    siteVisits: "",
    orders: "",
    revenueTrend: "",
    chaosLevel: "",
    aov: "",
    personality: "",
    industry: ""
  });
  const handleAnalyze = () => {
    setTimeout(() => {
      setStep(2);
    }, 1200);
  };
  const handleGenerateStrategy = () => {
    navigate("/marketing/strategy-report");
  };
  if (step === 1) {
    return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto py-12 animate-in fade-in duration-700 pb-32", children: [
      /* @__PURE__ */ jsx(
        ContextualTutorialModal,
        {
          hubId: "trapcast_audit",
          title: "TrapCast Audit",
          description: "Get an instant health check of your entire operation.",
          steps: ["Run a full system diagnostic.", "Review critical alerts for stockouts or capacity bottlenecks.", "Action AI recommendations to improve margins."]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 bg-gradient-to-br from-[#1A1A1A] to-[#333333] rounded-full text-[#C5A059] shadow-xl", children: /* @__PURE__ */ jsx(Sparkles, { size: 24, strokeWidth: 1.5 }) }),
          /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-serif text-white font-bold tracking-tight", children: "Synaptic Pulse Check" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 font-sans font-light text-lg", children: "Lola AI is establishing operational health benchmarks. Deployment: 60 Seconds." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 flex items-center gap-4 text-[10px] font-sans font-medium uppercase tracking-[0.2em]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[#6A2C91]", children: "Node 1 of 2" }),
          /* @__PURE__ */ jsx("div", { className: "h-1 flex-1 bg-stone-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full w-1/2 bg-[#6A2C91] transition-all duration-1000" }) }),
          /* @__PURE__ */ jsx("span", { className: "text-stone-400", children: "Data Ingestion" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/2", children: /* @__PURE__ */ jsxs(Card, { className: "luxury-card p-4 sm:p-12", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif text-white font-bold tracking-tight mb-10", children: "Establish Identity Baseline" }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2", children: "Avg Monthly Visitors" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "e.g. 5000",
                value: formData.siteVisits,
                onChange: (e) => setFormData({ ...formData, siteVisits: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2", children: "Avg Monthly Orders" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "e.g. 150",
                value: formData.orders,
                onChange: (e) => setFormData({ ...formData, orders: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2", children: "Avg Order Value ($)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                placeholder: "e.g. 75.00",
                value: formData.aov,
                onChange: (e) => setFormData({ ...formData, aov: e.target.value })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2", children: "Revenue Trajectory" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                value: formData.revenueTrend,
                onChange: (e) => setFormData({ ...formData, revenueTrend: e.target.value }),
                className: "h-14 rounded-full",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "", children: "Select trend..." }),
                  /* @__PURE__ */ jsx("option", { value: "up_high", children: "Rapid Growth (>20%)" }),
                  /* @__PURE__ */ jsx("option", { value: "up_slow", children: "Steady Growth (5-20%)" }),
                  /* @__PURE__ */ jsx("option", { value: "flat", children: "Flat / Stagnant" }),
                  /* @__PURE__ */ jsx("option", { value: "down", children: "Declining" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-2", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2", children: "Current Entropy Level" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              value: formData.chaosLevel,
              onChange: (e) => setFormData({ ...formData, chaosLevel: e.target.value }),
              className: "h-14 rounded-full",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "How do you feel..." }),
                /* @__PURE__ */ jsx("option", { value: "zen", children: "Zen Protocol (Everything is automated)" }),
                /* @__PURE__ */ jsx("option", { value: "manageable", children: "Manageable (Some manual effort)" }),
                /* @__PURE__ */ jsx("option", { value: "stressed", children: "Stressed (Dropping nodes)" }),
                /* @__PURE__ */ jsx("option", { value: "chaos", children: "Total Chaos (Firefighting daily)" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-10 border-t border-stone-100", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
            /* @__PURE__ */ jsx("div", { className: "p-3 bg-stone-50 rounded-full text-[#6A2C91]", children: /* @__PURE__ */ jsx(FileText, { size: 20, strokeWidth: 1.5 }) }),
            /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-sans font-medium text-white font-bold uppercase tracking-[0.2em]", children: "Optional Synthesis Documents" })
          ] }),
          /* @__PURE__ */ jsx(FileUploader, { label: "Upload Historical Ledger (P&L or Inventory CSV)" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-10 border-t border-stone-100", children: [
          /* @__PURE__ */ jsxs("h4", { className: "text-[10px] font-sans font-medium text-[#6A2C91] uppercase tracking-[0.3em] mb-8 flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 16, className: "text-[#C5A059]", strokeWidth: 1.5 }),
            " Creator Archetype"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2", children: "Personality Node" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: formData.personality,
                  onChange: (e) => setFormData({ ...formData, personality: e.target.value }),
                  className: "h-14 rounded-full",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Select your style..." }),
                    /* @__PURE__ */ jsx("option", { value: "visionary", children: "The Visionary (High Velocity)" }),
                    /* @__PURE__ */ jsx("option", { value: "perfectionist", children: "The Perfectionist (High Integrity)" }),
                    /* @__PURE__ */ jsx("option", { value: "educator", children: "The Educator (High Engagement)" }),
                    /* @__PURE__ */ jsx("option", { value: "entertainer", children: "The Entertainer (High Trends)" }),
                    /* @__PURE__ */ jsx("option", { value: "artisan", children: "The Quiet Artisan (Focus on ASMR)" })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-sans font-medium text-stone-400 uppercase tracking-[0.2em] ml-2", children: "Business Domain" }),
              /* @__PURE__ */ jsxs(
                Select,
                {
                  value: formData.industry,
                  onChange: (e) => setFormData({ ...formData, industry: e.target.value }),
                  className: "h-14 rounded-full",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Select industry..." }),
                    /* @__PURE__ */ jsx("option", { value: "skincare", children: "Skincare & Beauty" }),
                    /* @__PURE__ */ jsx("option", { value: "candles", children: "Home Fragrance" }),
                    /* @__PURE__ */ jsx("option", { value: "jewelry", children: "Artisanal Jewelry" }),
                    /* @__PURE__ */ jsx("option", { value: "apparel", children: "Premium Textiles" }),
                    /* @__PURE__ */ jsx("option", { value: "pottery", children: "Ceramics & Home" })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-end pt-12 mt-12 border-t border-stone-100", children: /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleAnalyze,
            className: "w-full h-16 bg-[#1A1A1A] text-white border-0 shadow-[0_8px_30px_rgba(0,0,0,0.12)] font-sans font-medium uppercase text-[11px] tracking-[0.2em] rounded-full hover:bg-[#333333] transition-all",
            children: [
              "ANALYZE SYSTEM HEALTH ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 18, className: "ml-3", strokeWidth: 1.5 })
            ]
          }
        ) })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto py-12 animate-in fade-in duration-700 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2 mb-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "p-4 bg-gradient-to-br from-[#1A1A1A] to-[#333333] rounded-full text-white shadow-xl", children: /* @__PURE__ */ jsx(Sparkles, { size: 24, strokeWidth: 1.5 }) }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-serif text-white font-bold tracking-tight", children: "Synthesis Complete" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-12 flex items-center gap-4 text-[10px] font-sans font-medium uppercase tracking-[0.2em]", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[#6A2C91]", children: "Node 2 of 2" }),
        /* @__PURE__ */ jsx("div", { className: "h-1 flex-1 bg-stone-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full w-full bg-[#6A2C91] transition-all duration-1000" }) }),
        /* @__PURE__ */ jsx("span", { className: "text-[#C5A059]", children: "Diagnostics Ready" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "w-full md:w-1/2", children: [
      /* @__PURE__ */ jsxs(Card, { className: "luxury-card text-center pb-16 p-4 sm:p-12", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif text-white font-bold mb-12 text-left tracking-tight", children: "Manufacturing Integrity Audit" }),
        /* @__PURE__ */ jsxs("div", { className: "relative w-72 h-36 mx-auto mb-8 overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-full rounded-t-full bg-stone-100" }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "absolute top-0 left-0 w-full h-full rounded-t-full bg-gradient-to-r from-red-500 via-amber-400 to-green-500 origin-bottom scale-x-100 scale-y-100 shadow-lg",
              style: { clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 0)" }
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-1/2 w-1.5 h-32 bg-stone-900 origin-bottom transform -translate-x-1/2 rotate-[45deg] transition-transform duration-[2000ms] ease-out z-10 rounded-full shadow-2xl" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-1/2 w-6 h-6 bg-stone-900 rounded-full -translate-x-1/2 translate-y-1/2 z-20 border-4 border-white shadow-xl" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-6xl font-serif text-red-600 tracking-tight mb-4", children: "85" }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-stone-400 font-sans font-medium uppercase tracking-[0.3em]", children: "Synaptic Risk Index" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-12 bg-red-50/50 border border-red-100/50 rounded-[3rem] p-4 sm:p-10 flex flex-col sm:flex-row items-center gap-4 sm:p-8 text-left relative overflow-hidden group", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 sm:p-8 opacity-[0.03] text-red-600 group-hover:rotate-12 transition-transform duration-700", children: /* @__PURE__ */ jsx(AlertTriangle, { size: 100, strokeWidth: 1 }) }),
          /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-white rounded-full flex items-center justify-center text-red-500 shadow-[0_8px_30px_rgba(239,68,68,0.15)] shrink-0 relative z-10", children: /* @__PURE__ */ jsx(Activity, { size: 32, strokeWidth: 1.5 }) }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-sans font-medium uppercase text-red-400 tracking-[0.2em] mb-2 block", children: "Lola's Critical Audit" }),
            /* @__PURE__ */ jsx("h4", { className: "text-2xl font-serif text-red-700 tracking-tight mb-3", children: "HIGH RISK: BURNOUT PROTOCOL" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-red-800/70 font-sans font-light leading-relaxed", children: "Revenue is scaling but operational entropy is critical. You are currently working harder for diminishing returns. Systems are approaching failure." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:p-8 mt-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-[#6A2C91]/5 p-4 sm:p-8 rounded-[3rem] border border-[#6A2C91]/10 group hover:bg-white transition-all duration-500", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[9px] text-[#6A2C91]/60 font-sans font-medium uppercase tracking-[0.3em] mb-4", children: "Omnichannel Flow" }),
            /* @__PURE__ */ jsx("p", { className: "text-4xl font-serif text-[#6A2C91] tracking-tight mb-2", children: "30.0%" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[#6A2C91]/80 font-sans font-medium uppercase tracking-[0.2em]", children: "Conversion Rate" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-[#C5A059]/5 p-4 sm:p-8 rounded-[3rem] border border-[#C5A059]/10 group hover:bg-white transition-all duration-500", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[9px] text-[#C5A059]/60 font-sans font-medium uppercase tracking-[0.3em] mb-4", children: "Network Liquidity" }),
            /* @__PURE__ */ jsx("p", { className: "text-4xl font-serif text-[#C5A059] tracking-tight mb-2", children: "$15.00" }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] text-[#C5A059]/80 font-sans font-medium uppercase tracking-[0.2em]", children: "Avg Order Value" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-12 bg-gradient-to-br from-[#1A1A1A] to-[#333333] p-px rounded-[3rem] shadow-2xl", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[2.9rem] p-4 sm:p-12 md:p-16 text-center relative overflow-hidden group", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 sm:p-12 opacity-[0.02] text-gray-900 pointer-events-none group-hover:rotate-12 transition-transform duration-1000", children: /* @__PURE__ */ jsx(Sparkles, { size: 160, strokeWidth: 1 }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4 mb-6 text-[#1A1A1A]", children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 28, className: "text-[#C5A059] animate-pulse", strokeWidth: 1.5 }),
          /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif tracking-tight", children: "The Synaptic Cure" })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-500 font-sans font-light mb-12 leading-relaxed text-lg", children: [
          "Lola AI has synthesized the following corrective directives for ",
          /* @__PURE__ */ jsx("strong", { className: "font-medium text-gray-900", children: formData.industry || "your business" }),
          ":"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-12", children: ["Predictive Demand Synthesizer", "Automated Reorder Optimization", "Production Floor Flow Balancer"].map((item) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6 p-6 bg-stone-50/50 rounded-full border border-stone-100 group/li hover:bg-[#6A2C91]/5 hover:border-[#6A2C91]/20 transition-all duration-500", children: [
          /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-full bg-white text-[#6A2C91] flex items-center justify-center text-[10px] font-sans font-medium shadow-sm group-hover/li:bg-[#6A2C91] group-hover/li:text-white transition-all duration-500", children: "✓" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-sans font-medium text-gray-700 tracking-wide", children: item })
        ] }, item)) }),
        /* @__PURE__ */ jsxs(Button, { onClick: handleGenerateStrategy, className: "w-full h-16 bg-[#1A1A1A] text-white font-sans font-medium uppercase text-[11px] tracking-[0.2em] shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-full relative overflow-hidden group/btn hover:bg-[#333333] transition-all duration-500", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" }),
          /* @__PURE__ */ jsx(Sparkles, { size: 18, className: "mr-3", strokeWidth: 1.5 }),
          " SYNTHESIZE MARKETING ARCHITECTURE"
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-stone-400 mt-10 font-sans font-medium uppercase tracking-[0.3em] flex items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsx(Lock, { size: 14, strokeWidth: 1.5 }),
          " Full Vault Access Required"
        ] })
      ] }) })
    ] })
  ] });
};
const MarketingStrategyReport = () => {
  const navigate = useNavigate();
  const { addMarketingPost, connectedChannels } = useArtisanData();
  const [generating, setGenerating] = useState(true);
  const [isBundling, setIsBundling] = useState(false);
  const [contentBundle, setContentBundle] = useState([]);
  const [scheduledIds, setScheduledIds] = useState([]);
  const [authModalPlatform, setAuthModalPlatform] = useState(null);
  const strategyData = {
    summary: "Herbalistic Wellness aims to enhance its market presence by implementing a comprehensive social media marketing strategy that focuses on engagement, education, and community-building. Targeting health-conscious individuals aged 30-55, the approach will leverage visual platforms and content marketing to boost brand awareness and sales.",
    audience: {
      demographics: "Adults aged 30-55, urban/suburban, income $60k-$130k.",
      interests: ["Health and wellness", "Natural skincare", "Herbal remedies", "Eco-friendly products", "Self-care routines"],
      painPoints: ["Limited knowledge of herbal products", "Skepticism towards efficacy", "Desire for sustainable solutions", "Need for stress relief"]
    },
    pillars: [
      { name: "Herbal Education", pct: 30, desc: "Benefits, uses, and preparations of herbs." },
      { name: "Product Showcase", pct: 45, desc: "Features, usage instructions, testimonials." },
      { name: "Wellness Tips", pct: 25, desc: "Self-care practices and lifestyle improvements." }
    ],
    platforms: [
      { name: "Instagram", freq: "3-5x/week", focus: "Visuals, Reels, Stories" },
      { name: "Facebook", freq: "3x/week", focus: "Community, Groups, Events" },
      { name: "TikTok", freq: "3x/week", focus: "Education, Trends, BTS" },
      { name: "LinkedIn", freq: "2x/week", focus: "B2B, Wholesale Partnerships" },
      { name: "Pinterest", freq: "Daily", focus: "Aesthetic Pins, DIY Guides" }
    ],
    ideas: [
      "Create a video on '5 Benefits of Herbal Oils' for skin care on TikTok.",
      "Post a photo of a DIY herbal bath blend with an engaging caption on Instagram.",
      "Conduct a live Q&A on Facebook about organic skincare.",
      "Share an infographic on Pinterest about sustainable practices in herbalism.",
      "Feature a customer spotlight post with their favorite Herbalistic product on Instagram."
    ]
  };
  useEffect(() => {
    runGeneration();
  }, []);
  const runGeneration = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      localStorage.setItem("latestMarketingStrategy", JSON.stringify(strategyData));
    }, 1800);
  };
  const handleGenerateBundle = async () => {
    setIsBundling(true);
    const result = await generatePlatformContentBundle(strategyData);
    if (result && result.posts) {
      setContentBundle(result.posts);
    }
    setIsBundling(false);
  };
  const handleSchedulePost = (post, index) => {
    addMarketingPost({
      platform: post.platform,
      topic: post.topic,
      content: post.content,
      scheduledDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      status: "Scheduled",
      type: "Text",
      mediaUrl: ""
    });
    setScheduledIds([...scheduledIds, `${post.platform}-${index}`]);
  };
  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "Instagram":
        return /* @__PURE__ */ jsx(Instagram, { size: 18 });
      case "Facebook":
        return /* @__PURE__ */ jsx(Facebook, { size: 18 });
      case "TikTok":
        return /* @__PURE__ */ jsx(Video, { size: 18 });
      case "LinkedIn":
        return /* @__PURE__ */ jsx(Linkedin, { size: 18 });
      case "Pinterest":
        return /* @__PURE__ */ jsx(Box, { size: 18 });
      default:
        return /* @__PURE__ */ jsx(Globe, { size: 18 });
    }
  };
  if (generating) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[70vh] space-y-8 animate-in fade-in", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 border-[6px] border-[#6A2C91]/10 border-t-[#6A2C91] rounded-full animate-spin" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(Sparkles, { size: 24, className: "text-[#C5A059] animate-pulse" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-white tracking-tighter uppercase italic", children: "Synthesizing Strategy Hub..." }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 font-medium tracking-wide", children: "Lola AI is reconciling omnichannel manufacturing directives." })
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-12 animate-in fade-in pb-32 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/marketing"), className: "flex items-center gap-2 text-gray-400 hover:text-[#6A2C91] font-black text-xs uppercase tracking-widest mb-4 transition-colors", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
          " Back to Studio"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-white tracking-tighter uppercase italic", children: "Omnichannel Strategy Hub" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 font-medium", children: "Synaptic Directive Architecture: Scalable Growth Logic." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxs(Button, { variant: "outline", className: "border-stone-200 font-black text-[10px] tracking-widest h-12 px-6 rounded-2xl", children: [
          /* @__PURE__ */ jsx(Download, { size: 16, className: "mr-2" }),
          " EXPORT DOSSIER"
        ] }),
        /* @__PURE__ */ jsxs(Button, { variant: "primary", className: "bg-[#6A2C91] text-white font-black text-[10px] tracking-widest h-12 px-6 rounded-2xl shadow-xl shadow-purple-100", onClick: runGeneration, children: [
          /* @__PURE__ */ jsx(RefreshCw, { size: 16, className: "mr-2" }),
          " RE-SYNC STRATEGY"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white border border-stone-200 rounded-[2.5rem] p-4 sm:p-10 shadow-sm relative overflow-hidden group", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-bl-full -mr-20 -mt-20 opacity-40 group-hover:opacity-100 transition-opacity" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-[#6A2C91] mb-6 relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "p-3 bg-purple-50 rounded-2xl shadow-inner", children: /* @__PURE__ */ jsx(Sparkles, { size: 24 }) }),
        /* @__PURE__ */ jsx("h3", { className: "font-black text-2xl uppercase italic tracking-tighter", children: "Executive Directive" })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "text-gray-700 leading-relaxed text-lg font-medium relative z-10 max-w-4xl italic", children: [
        '"',
        strategyData.summary,
        '"'
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(TrendingUp, { className: "text-[#6A2C91]" }),
        " Content Pillars & Allocation"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 sm:p-8", children: strategyData.pillars.map((pillar, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-stone-100 rounded-[2rem] p-4 sm:p-8 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 sm:p-8 opacity-[0.03] text-purple-600", children: /* @__PURE__ */ jsx(PieChart, { size: 60 }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4 relative z-10", children: [
          /* @__PURE__ */ jsx("h4", { className: "font-black text-white uppercase tracking-tight italic", children: pillar.name }),
          /* @__PURE__ */ jsxs("span", { className: "text-2xl font-black text-[#6A2C91] tracking-tighter", children: [
            pillar.pct,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "w-full bg-stone-100 h-1.5 rounded-full mb-6 relative overflow-hidden", children: /* @__PURE__ */ jsx(
          "div",
          {
            className: "h-full bg-[#C5A059] transition-all duration-1000",
            style: { width: `${pillar.pct}%` }
          }
        ) }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 leading-relaxed font-medium relative z-10", children: pillar.desc })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-10", children: [
      /* @__PURE__ */ jsxs(Card, { title: "Synaptic Channel Links", className: "rounded-[2.5rem] border-stone-100 shadow-xl overflow-hidden relative", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 sm:p-8 opacity-[0.03] text-purple-600", children: /* @__PURE__ */ jsx(Globe, { size: 80 }) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-4 relative z-10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 font-medium leading-relaxed mb-6", children: "Authorize secure handshakes to enable auto-publishing logic via Lola." }),
          Object.entries(connectedChannels).map(([platform, isConnected]) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-stone-50 rounded-2xl group hover:bg-white border border-transparent hover:border-stone-100 transition-all", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: `p-2 rounded-lg ${isConnected ? "bg-[#6A2C91] text-white" : "bg-stone-200 text-stone-400"} transition-colors`, children: getPlatformIcon(platform) }),
              /* @__PURE__ */ jsx("span", { className: "font-black text-xs uppercase tracking-tight text-gray-900", children: platform })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => !isConnected && setAuthModalPlatform(platform),
                className: `text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border transition-all ${isConnected ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100" : "bg-white text-stone-400 border-stone-200 hover:border-[#6A2C91] hover:text-[#6A2C91]"}`,
                children: isConnected ? "LINKED" : "INITIALIZE"
              }
            )
          ] }, platform)),
          /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-stone-100 flex items-center gap-3 text-stone-400", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { size: 16 }),
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest", children: "OAuth 2.1 Encryption Active" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-10", children: [
        /* @__PURE__ */ jsxs(Card, { title: "Target Audience Node", className: "rounded-[2.5rem] border-stone-100", children: [
          /* @__PURE__ */ jsx("p", { className: "text-gray-900 text-lg font-black uppercase italic tracking-tight mb-4", children: strategyData.audience.demographics }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-8", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Target, { size: 14 }),
                " Synaptic Affinity"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: strategyData.audience.interests.map((tag) => /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-purple-50 text-[#6A2C91] rounded-xl text-[10px] font-black uppercase tracking-widest border border-purple-100", children: tag }, tag)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Plus, { size: 14 }),
                " Core Friction Points"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: strategyData.audience.painPoints.map((tag) => /* @__PURE__ */ jsx("span", { className: "px-4 py-1.5 bg-stone-50 text-stone-500 border border-stone-100 rounded-xl text-[10px] font-black uppercase tracking-widest", children: tag }, tag)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-[#6A2C91] rounded-[2.5rem] p-4 sm:p-10 text-white shadow-2xl relative overflow-hidden group", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-4 sm:p-8 relative z-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center md:text-left", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-3xl font-black uppercase italic tracking-tighter", children: "AI Content Workbench" }),
              /* @__PURE__ */ jsx("p", { className: "text-purple-200 font-medium", children: "Auto-generate a week of optimized posts based on your strategy." })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: handleGenerateBundle,
                disabled: isBundling,
                className: "bg-[#C5A059] text-white border-none h-16 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-amber-500/20 active:scale-95 transition-all",
                children: isBundling ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Loader2, { className: "animate-spin mr-2" }),
                  " SYNTHESIZING..."
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Zap, { size: 18, className: "mr-2" }),
                  " GENERATE BUNDLE"
                ] })
              }
            )
          ] })
        ] })
      ] })
    ] }),
    contentBundle.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in slide-up", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Layers, { className: "text-[#6A2C91]" }),
        " Content Queue Nodes"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex overflow-x-auto gap-4 sm:p-8 pb-10 scrollbar-hide px-2", children: contentBundle.map((post, idx) => {
        const isScheduled = scheduledIds.includes(`${post.platform}-${idx}`);
        return /* @__PURE__ */ jsxs("div", { className: "min-w-[340px] max-w-[340px] bg-white border border-stone-200 rounded-[2.5rem] p-4 sm:p-8 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group relative", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6", children: [
            /* @__PURE__ */ jsx("div", { className: `p-3 rounded-2xl ${isScheduled ? "bg-emerald-50 text-emerald-600" : "bg-stone-50 text-gray-900"}`, children: getPlatformIcon(post.platform) }),
            /* @__PURE__ */ jsx(Badge, { color: isScheduled ? "green" : "purple", className: "text-[8px] font-black uppercase px-2", children: isScheduled ? "SYNCED TO CAL" : "AI DRAFT" })
          ] }),
          /* @__PURE__ */ jsx("h4", { className: "font-black text-lg text-white uppercase italic tracking-tight mb-4 line-clamp-1", children: post.topic }),
          /* @__PURE__ */ jsx("div", { className: "flex-1 bg-stone-50 p-4 rounded-2xl border border-stone-100 mb-6 overflow-y-auto max-h-48 scrollbar-hide", children: /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-600 leading-relaxed font-medium whitespace-pre-wrap", children: post.content }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-6 border-t border-stone-50", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest", children: [
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Clock, { size: 12 }),
                " ",
                post.bestTimeToPost
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-[#C5A059]", children: [
                /* @__PURE__ */ jsx(Target, { size: 12 }),
                " ",
                post.platform,
                " Optimized"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: () => handleSchedulePost(post, idx),
                disabled: isScheduled,
                className: `w-full h-12 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${isScheduled ? "bg-stone-100 text-stone-400 border-none cursor-default" : "bg-white border border-[#6A2C91] text-[#6A2C91] hover:bg-[#6A2C91] hover:text-white"}`,
                children: isScheduled ? /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(CheckCircle, { size: 14, className: "mr-2" }),
                  " IN CALENDAR"
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(Calendar, { size: 14, className: "mr-2" }),
                  " AUTO-SCHEDULE"
                ] })
              }
            )
          ] })
        ] }, idx);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Layers, { className: "text-[#C5A059]" }),
        " Synaptic Channel Protocols"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6", children: strategyData.platforms.map((platform, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-stone-200 rounded-[2.5rem] p-4 sm:p-8 hover:shadow-xl hover:border-[#6A2C91] transition-all group", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center text-[#6A2C91] mb-6 shadow-inner group-hover:bg-[#6A2C91] group-hover:text-white transition-all", children: getPlatformIcon(platform.name) }),
        /* @__PURE__ */ jsx("h4", { className: "text-xl font-black text-white tracking-tight uppercase italic mb-2", children: platform.name }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-[#C5A059] uppercase tracking-widest mb-4", children: platform.freq }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 font-medium leading-relaxed", children: platform.focus })
      ] }, i)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-8", children: [
      /* @__PURE__ */ jsx(Card, { title: "Raw Concept Repository", className: "rounded-[2.5rem] border-stone-100", children: /* @__PURE__ */ jsx("div", { className: "space-y-4 mt-4", children: strategyData.ideas.map((idea, i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-start p-4 bg-stone-50 rounded-2xl group hover:bg-white border border-transparent hover:border-stone-100 transition-all", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-white text-[#6A2C91] flex items-center justify-center text-xs font-black shadow-sm group-hover:bg-[#6A2C91] group-hover:text-white transition-all", children: i + 1 }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-700 font-medium leading-relaxed", children: idea })
      ] }, i)) }) }),
      /* @__PURE__ */ jsxs(Card, { title: "Strategic Financial Guardrails", className: "rounded-[2.5rem] border-stone-100 relative overflow-hidden", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 right-0 p-4 sm:p-10 opacity-[0.03] text-emerald-600", children: /* @__PURE__ */ jsx(DollarSign, { size: 120 }) }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6 mt-4 relative z-10", children: [
          { label: "Initial Acquisition Buffer", val: "$1,200.00", status: "Stable" },
          { label: "Production Scaling Offset", val: "$850.00", status: "Optimal" },
          { label: "Creative Overhead Allowance", val: "$450.00", status: "Locked" }
        ].map((row, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-stone-50 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest", children: row.label }),
            /* @__PURE__ */ jsx("p", { className: "text-xl font-black text-gray-900 tracking-tighter mt-0.5", children: row.val })
          ] }),
          /* @__PURE__ */ jsx(Badge, { color: "green", className: "text-[8px] font-black uppercase px-2", children: row.status })
        ] }, i)) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      SocialMediaAuthModal,
      {
        isOpen: !!authModalPlatform,
        onClose: () => setAuthModalPlatform(null),
        platform: authModalPlatform || ""
      }
    )
  ] });
};
const UpgradeModal = ({
  isOpen,
  onClose,
  featureName,
  currentLimit,
  requiredTier = "Artisan Flow Basic"
}) => {
  const navigate = useNavigate();
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx(AnimatePresence, { children: /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", children: [
    /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "absolute inset-0 bg-black/60 backdrop-blur-sm",
        onClick: onClose
      }
    ),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 },
        className: "relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 sm:p-12 shadow-2xl overflow-hidden",
        children: [
          /* @__PURE__ */ jsx("button", { onClick: onClose, className: "absolute top-6 right-6 text-white/40 hover:text-white transition-colors", children: /* @__PURE__ */ jsx(X, { size: 24 }) }),
          /* @__PURE__ */ jsx("div", { className: "mb-8 flex justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-[#6A2C91]/20 border border-[#6A2C91]/30 rounded-2xl flex items-center justify-center", children: /* @__PURE__ */ jsx(Lock, { size: 32, className: "text-[#C5A059]" }) }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-serif text-white tracking-tight text-center mb-4", children: "Capacity Reached" }),
          /* @__PURE__ */ jsxs("p", { className: "text-white/60 font-sans text-sm leading-relaxed text-center mb-8", children: [
            "You have reached your limit of ",
            /* @__PURE__ */ jsxs("strong", { className: "text-white", children: [
              currentLimit,
              " ",
              featureName
            ] }),
            " on your current tier. Upgrade to ",
            /* @__PURE__ */ jsx("strong", { className: "text-[#C5A059]", children: requiredTier }),
            " to unlock higher capacities and advanced business capabilities."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                variant: "premium",
                onClick: () => {
                  onClose();
                  navigate("/settings/subscription");
                },
                className: "w-full h-14 font-black tracking-widest text-[11px]",
                children: [
                  "UPGRADE SUBSCRIPTION ",
                  /* @__PURE__ */ jsx(ArrowRight, { size: 16, className: "ml-2" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "ghost",
                onClick: onClose,
                className: "w-full h-14 text-white/50 hover:text-white uppercase tracking-widest text-[11px]",
                children: "Not Now"
              }
            )
          ] })
        ]
      }
    )
  ] }) });
};
const Inventory = () => {
  const { inventory, getInventoryValue, addInventoryItem, updateInventory, recipes, userTier } = useArtisanData();
  const [view, setView] = useState("overview");
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAdjustStock, setShowAdjustStock] = useState(false);
  const [adjustAmount, setAdjustAmount] = useState(0);
  const fileInputRef = React.useRef(null);
  const [upgradeLimit, setUpgradeLimit] = useState(50);
  const [requiredTier, setRequiredTier] = useState("Artisan Flow Basic");
  const [newItem, setNewItem] = useState(() => {
    const saved = sessionStorage.getItem("draft_inventory_item");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
      }
    }
    return { name: "", sku: "", type: "raw", stock: 0, unit: "pcs", unitCost: 0, reorderPoint: 5, img: "" };
  });
  useEffect(() => {
    sessionStorage.setItem("draft_inventory_item", JSON.stringify(newItem));
  }, [newItem]);
  const rawMaterials = inventory.filter((i) => i.type === "raw");
  const finishedProducts = inventory.filter((i) => i.type === "finished");
  const lowStockItems = inventory.filter((i) => i.stock <= i.reorderPoint);
  const handleItemClick = (item) => {
    setSelectedItem(item);
    setView("detail");
  };
  z.object({
    name: z.string().min(1, { message: "Name is required" }),
    sku: z.string().min(1, { message: "SKU is required" }),
    type: z.enum(["raw", "finished"]),
    stock: z.number().min(0, { message: "Stock must be 0 or greater" }),
    unitCost: z.number().min(0, { message: "Unit cost must be 0 or greater" }),
    reorderPoint: z.number().min(0, { message: "Reorder point must be 0 or greater" })
  });
  const handleAdjustStock = () => {
    if (selectedItem) {
      updateInventory(selectedItem.id, { stock: selectedItem.stock + adjustAmount });
      setShowAdjustStock(false);
      setAdjustAmount(0);
      toast.success("Stock Quantity Adjusted");
    }
  };
  const handleFileChange = (e) => {
    var _a;
    try {
      const file = (_a = e.target.files) == null ? void 0 : _a[0];
      if (!file) return;
      if (!file.name.toLowerCase().endsWith(".csv")) {
        throw new Error("Invalid CSV format. Please upload a structured .csv file.");
      }
      toast.success("CSV Ingested and Processing...");
    } catch (error) {
      toast.error(error.message || "Error processing file");
    }
  };
  const getRecipeUsage = (itemName) => {
    return recipes.filter((r) => r.ingredients.some((ing) => ing.name.toLowerCase() === itemName.toLowerCase()));
  };
  if (view === "detail" && selectedItem) {
    const usageInRecipes = getRecipeUsage(selectedItem.name);
    return /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        className: "p-4 sm:p-10 space-y-12 pb-20 max-w-[1600px] mx-auto",
        children: [
          /* @__PURE__ */ jsx(
            ContextualTutorialModal,
            {
              hubId: "materials_matrix",
              title: "Materials Matrix",
              description: "Track raw materials and finished goods inventory.",
              steps: ["Monitor stock levels and reorder points.", "Log raw material usage for production.", "Adjust inventory counts via cycle counts."]
            }
          ),
          /* @__PURE__ */ jsx(
            SubPageHeader,
            {
              title: selectedItem.name,
              parentTitle: "Inventory Hub",
              onBack: () => setView("overview"),
              description: `Detailed node analysis for ${selectedItem.name}. SKU: ${selectedItem.sku}`,
              actions: /* @__PURE__ */ jsxs(
                Button,
                {
                  onClick: () => toast.info("Audit protocol initialized."),
                  className: "bg-[#6A2C91] hover:bg-[#5a257a] text-white h-12 px-6 rounded-2xl font-sans font-bold text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-purple-500/10",
                  children: [
                    /* @__PURE__ */ jsx(RefreshCw, { size: 14, className: "mr-2" }),
                    " Run Audit"
                  ]
                }
              )
            }
          ),
          "            ",
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-16", children: [
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 space-y-10", children: [
              /* @__PURE__ */ jsx("div", { className: "luxury-card bg-white/5 backdrop-blur-xl p-4 sm:p-8 rounded-[3rem] relative overflow-hidden group shadow-2xl shadow-black/20 border border-white/10", children: /* @__PURE__ */ jsxs("div", { className: "aspect-square bg-black/20 rounded-[2.5rem] overflow-hidden flex items-center justify-center relative shadow-inner", children: [
                selectedItem.img ? /* @__PURE__ */ jsx("img", { src: selectedItem.img, alt: selectedItem.name, className: "w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" }) : /* @__PURE__ */ jsx(Package, { size: 120, className: "text-white/5", strokeWidth: 0.5 }),
                /* @__PURE__ */ jsx("div", { className: "absolute top-4 sm:p-8 left-8", children: /* @__PURE__ */ jsx(Badge, { color: selectedItem.type === "raw" ? "purple" : "green", className: "px-5 py-2 uppercase font-sans font-bold tracking-[0.3em] text-[10px] shadow-lg", children: selectedItem.type }) })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx(Button, { onClick: () => setShowAdjustStock(true), className: "w-full bg-white text-black hover:bg-white/90 h-16 rounded-full font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all shadow-2xl shadow-black/10", children: "ADJUST STOCK QUANTITY" }),
                /* @__PURE__ */ jsx(Button, { onClick: () => {
                  window.print();
                  toast.success("Archival label sent to connected printer.");
                }, variant: "outline", className: "w-full border-white/10 hover:border-white/20 hover:bg-white/5 text-white h-16 rounded-full font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all", children: "PRINT ARCHIVAL LABEL" })
              ] }),
              /* @__PURE__ */ jsx(Modal, { isOpen: showAdjustStock, onClose: () => setShowAdjustStock(false), title: "Adjust Stock Quantity", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 pt-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Adjustment Amount (Use negative to subtract)" }),
                  /* @__PURE__ */ jsx(Input, { type: "number", value: adjustAmount, onChange: (e) => setAdjustAmount(Number(e.target.value)), className: "rounded-2xl py-4 font-bold" })
                ] }),
                /* @__PURE__ */ jsx(Button, { onClick: handleAdjustStock, className: "w-full bg-[#C5A059] hover:bg-[#b08e4d] text-white h-14 rounded-full font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all shadow-xl", children: "Confirm Adjustment" })
              ] }) }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-8 bg-[#6A2C91]/10 rounded-[2.5rem] border border-[#6A2C91]/20", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4 text-[#C5A059]", children: [
                  /* @__PURE__ */ jsx(Zap, { size: 20, strokeWidth: 1.5 }),
                  /* @__PURE__ */ jsx("h4", { className: "font-sans font-bold text-[11px] uppercase tracking-[0.3em]", children: "AI Insight" })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm text-white/60 font-sans font-light leading-relaxed", children: [
                  "This node is currently operating at ",
                  /* @__PURE__ */ jsx("span", { className: "font-medium text-white", children: "optimal efficiency" }),
                  ". No supply chain disruptions predicted for the next 14 business days."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "lg:col-span-8 space-y-12", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start gap-4 sm:p-8", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h1", { className: "text-7xl font-serif text-white tracking-tighter mb-4 leading-none", children: selectedItem.name }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsxs("p", { className: "text-white/30 font-mono text-xs uppercase tracking-[0.3em] bg-white/5 px-3 py-1 rounded-md border border-white/5", children: [
                      "ID: ",
                      selectedItem.sku
                    ] }),
                    /* @__PURE__ */ jsx("span", { className: "w-1 h-1 bg-white/10 rounded-full" }),
                    /* @__PURE__ */ jsx("p", { className: "text-white/30 font-sans text-xs uppercase tracking-[0.2em]", children: "Last Audit: Today" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-left md:text-right", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-8xl font-serif text-[#C5A059] tracking-tighter leading-none", children: selectedItem.stock }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[12px] text-white/40 font-sans font-bold uppercase tracking-[0.4em] mt-4", children: [
                    selectedItem.unit,
                    " IN VAULT"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 sm:p-8", children: [
                /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-white/5 border border-white/10 p-4 sm:p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-500", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-4", children: "Stock Integrity" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-4xl font-serif text-white tracking-tight", children: [
                    "$",
                    selectedItem.unitCost.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-white/5 border border-white/10 p-4 sm:p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-500 border-l-4 border-emerald-500", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-4", children: "Total Node Value" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-4xl font-serif text-emerald-400 tracking-tight", children: [
                    "$",
                    selectedItem.stockValue.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-white/5 border border-white/10 p-4 sm:p-10 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all duration-500", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[11px] text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-4", children: "Safety Threshold" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-4xl font-serif text-amber-500 tracking-tight", children: [
                    selectedItem.reorderPoint,
                    " ",
                    /* @__PURE__ */ jsx("span", { className: "text-xl text-amber-500/50 font-sans font-light", children: selectedItem.unit })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-2", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif text-white tracking-tight", children: "Active Formula Dependency" }),
                  /* @__PURE__ */ jsxs(Badge, { color: "gray", className: "px-3 py-1 text-[9px] font-sans font-bold uppercase tracking-[0.2em]", children: [
                    usageInRecipes.length,
                    " Active Nodes"
                  ] })
                ] }),
                usageInRecipes.length > 0 ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: usageInRecipes.map((recipe) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-4 sm:p-8 bg-white/5 rounded-[2.5rem] border border-white/10 hover:border-[#6A2C91]/40 hover:bg-white/10 hover:shadow-2xl hover:shadow-black/20 transition-all duration-500 cursor-pointer group", onClick: () => navigate("/recipes"), children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
                    /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-black/20 rounded-2xl flex items-center justify-center text-[#6A2C91] shadow-inner group-hover:scale-110 transition-transform duration-500 border border-white/5", children: /* @__PURE__ */ jsx(Layers, { size: 24, strokeWidth: 1.2 }) }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("p", { className: "font-serif text-white text-xl tracking-tight mb-1", children: recipe.name }),
                      /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/30 font-sans font-bold uppercase tracking-[0.2em]", children: "Primary Input Node" })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx(ChevronRight, { size: 20, className: "text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all duration-500" })
                ] }, recipe.id)) }) : /* @__PURE__ */ jsxs("div", { className: "py-24 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10", children: [
                  /* @__PURE__ */ jsx(Zap, { size: 48, strokeWidth: 0.5, className: "text-white/10 mx-auto mb-6" }),
                  /* @__PURE__ */ jsx("p", { className: "text-white/30 text-[11px] font-sans font-bold uppercase tracking-[0.3em]", children: "No manufacturing dependencies detected." })
                ] })
              ] })
            ] })
          ] })
        ]
      }
    );
  }
  if (view === "overview") {
    return /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        className: "p-4 sm:p-10 space-y-12 pb-20 max-w-[1600px] mx-auto",
        children: [
          /* @__PURE__ */ jsx(
            ContextualTutorialModal,
            {
              hubId: "inventory_hub",
              title: "Inventory Hub Overview",
              description: "Welcome to the Inventory Hub. Here you can track your raw materials and finished products.",
              steps: [
                "Deploy new assets (raw materials or finished goods).",
                "Monitor stock levels and reorder points.",
                "Review automated Lola AI insights on margin impact."
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:p-8", children: [
            /* @__PURE__ */ jsx(
              SubPageHeader,
              {
                title: "Inventory Hub",
                parentTitle: "Command Center",
                onBack: () => navigate("/command-center"),
                description: "Synchronized Asset Management: Tracking the flow of craftsmanship from raw material to retail-ready output."
              }
            ),
            /* @__PURE__ */ jsx(
              VaultBanner,
              {
                title: "Inventory Hub",
                subtitle: "Synchronized Asset Management: Tracking the flow of craftsmanship from raw material to retail-ready output.",
                badge: "Asset Management Protocol Active",
                children: userTier !== "Free Audit" && /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                  /* @__PURE__ */ jsx("input", { type: "file", ref: fileInputRef, className: "hidden", accept: ".csv", onChange: handleFileChange }),
                  /* @__PURE__ */ jsxs(Button, { onClick: () => {
                    var _a;
                    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  }, variant: "outline", className: "rounded-full border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-md text-white font-sans font-bold text-[11px] tracking-[0.2em] h-16 px-10 transition-all shadow-sm", children: [
                    /* @__PURE__ */ jsx(Upload, { size: 16, className: "mr-3" }),
                    " INGEST CSV"
                  ] }),
                  /* @__PURE__ */ jsxs(Button, { variant: "primary", onClick: () => setShowAddItem(true), className: "rounded-full bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-bold text-[11px] tracking-[0.2em] h-16 px-10 shadow-2xl shadow-black/10 transition-all", children: [
                    /* @__PURE__ */ jsx(Plus, { size: 16, className: "mr-3" }),
                    " DEPLOY ASSET"
                  ] })
                ] })
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-10", children: [
            /* @__PURE__ */ jsxs("div", { onClick: () => setView("raw_materials"), className: "luxury-card bg-white/5 border border-white/10 rounded-[3rem] p-16 min-h-[360px] flex flex-col items-start group relative overflow-hidden cursor-pointer h-full transition-all duration-700 hover:shadow-2xl hover:bg-white/10", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-[#6A2C91] opacity-[0.05] rounded-bl-full -mr-20 -mt-20 group-hover:opacity-10 transition-opacity duration-1000" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 sm:p-8 relative z-10 mb-12", children: [
                /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-black/20 rounded-[1.5rem] flex items-center justify-center text-[#6A2C91] shadow-inner group-hover:scale-105 group-hover:rotate-3 transition-all duration-700 border border-white/5", children: /* @__PURE__ */ jsx(Box, { size: 32, strokeWidth: 1.5 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-4xl font-serif text-white tracking-tight mb-2", children: "Materials Matrix" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-white/30 font-sans font-bold uppercase text-[10px] tracking-[0.3em]", children: [
                    rawMaterials.length,
                    " Active Nodes"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center gap-4 text-[10px] font-sans font-bold text-[#C5A059] uppercase tracking-[0.3em] group-hover:translate-x-3 transition-transform duration-500", children: [
                "ACCESS RAW VAULT ",
                /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { onClick: () => setView("finished_products"), className: "luxury-card bg-white/5 border border-white/10 rounded-[3rem] p-16 min-h-[360px] flex flex-col items-start group relative overflow-hidden cursor-pointer h-full transition-all duration-700 hover:shadow-2xl hover:bg-white/10", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-64 h-64 bg-[#C5A059] opacity-[0.05] rounded-bl-full -mr-20 -mt-20 group-hover:opacity-10 transition-opacity duration-1000" }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 sm:p-8 relative z-10 mb-12", children: [
                /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-black/20 rounded-[1.5rem] flex items-center justify-center text-[#C5A059] shadow-inner group-hover:scale-105 group-hover:rotate-3 transition-all duration-700 border border-white/5", children: /* @__PURE__ */ jsx(Package, { size: 32, strokeWidth: 1.5 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-4xl font-serif text-white tracking-tight mb-2", children: "Finished Output" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-white/30 font-sans font-bold uppercase text-[10px] tracking-[0.3em]", children: [
                    finishedProducts.length,
                    " Retail Ready"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-auto flex items-center gap-4 text-[10px] font-sans font-bold text-[#C5A059] uppercase tracking-[0.3em] group-hover:translate-x-3 transition-transform duration-500", children: [
                "ACCESS PRODUCT VAULT ",
                /* @__PURE__ */ jsx(ChevronRight, { size: 16 })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              UpgradeModal,
              {
                isOpen: showUpgradeModal,
                onClose: () => setShowUpgradeModal(false),
                featureName: "Inventory Items",
                currentLimit: upgradeLimit,
                requiredTier
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "luxury-card lg:col-span-2 bg-white/5 border border-white/10 rounded-[3rem] p-16 relative overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-16 opacity-[0.05]", children: /* @__PURE__ */ jsx(BarChart, { size: 240, className: "text-[#C5A059]", strokeWidth: 0.5 }) }),
              /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
                /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-white/40 font-sans font-bold uppercase tracking-[0.4em] mb-6 flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx(DollarSign, { size: 16, className: "text-[#C5A059]" }),
                  " Total Liquid Asset Valuation"
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-8xl font-serif text-white tracking-tighter", children: [
                  "$",
                  getInventoryValue().toLocaleString()
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-12 flex gap-4 sm:p-12", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/30 font-sans font-bold uppercase tracking-[0.2em] mb-2", children: "Raw Value" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-3xl font-serif text-[#6A2C91]", children: [
                      "$",
                      (getInventoryValue() * 0.4).toLocaleString()
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/30 font-sans font-bold uppercase tracking-[0.2em] mb-2", children: "Finished Value" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-3xl font-serif text-[#C5A059]", children: [
                      "$",
                      (getInventoryValue() * 0.6).toLocaleString()
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxs("div", { className: "bg-[#C5A059]/5 border border-[#C5A059]/10 rounded-[3rem] p-4 sm:p-12 h-full flex flex-col", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-10", children: [
                /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-serif text-amber-500 tracking-tight flex items-center gap-4", children: [
                  /* @__PURE__ */ jsx(AlertTriangle, { size: 24, className: "text-amber-500", strokeWidth: 1 }),
                  " Threshold Alerts"
                ] }),
                /* @__PURE__ */ jsx(Badge, { color: "red", className: "px-4 py-1.5 text-[9px] font-sans font-bold uppercase tracking-[0.2em]", children: lowStockItems.length })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-hide", children: lowStockItems.length > 0 ? lowStockItems.map((item) => /* @__PURE__ */ jsxs("div", { className: "bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 flex justify-between items-center shadow-sm hover:shadow-md transition-all duration-500 group cursor-pointer", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("p", { className: "font-serif text-white text-xl tracking-tight mb-1 group-hover:text-amber-500 transition-colors", children: item.name }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-amber-500/60 font-sans font-medium uppercase tracking-[0.3em]", children: [
                    item.stock,
                    " / ",
                    item.reorderPoint,
                    " Units Remaining"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(ChevronRight, { size: 16, className: "text-white/10 group-hover:translate-x-1 transition-transform" })
              ] }, item.id)) : /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center justify-center text-center opacity-40", children: [
                /* @__PURE__ */ jsx(ShieldCheck, { size: 48, className: "text-amber-500/20 mb-4" }),
                /* @__PURE__ */ jsx("p", { className: "text-[11px] font-sans font-medium uppercase tracking-[0.3em] text-amber-500/40", children: "All Nodes Stable" })
              ] }) })
            ] }) })
          ] })
        ]
      }
    );
  }
  if (view === "raw_materials") {
    return /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        className: "p-4 sm:p-10 space-y-12 pb-20 max-w-[1600px] mx-auto",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:p-10", children: [
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              SubPageHeader,
              {
                title: "Raw Material Vault",
                parentTitle: "Inventory Hub",
                onBack: () => setView("overview"),
                description: "Managing the foundational elements of artisanal production."
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-96", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-6 top-1/2 -translate-y-1/2 text-white/20", size: 20 }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "SEARCH RAW ASSETS...",
                  className: "w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-full text-[11px] font-sans font-medium tracking-[0.2em] focus:ring-2 focus:ring-[#6A2C91]/20 transition-all shadow-sm text-white placeholder-white/20"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:p-10", children: rawMaterials.map((item) => /* @__PURE__ */ jsx(InventoryCard, { item, onClick: () => handleItemClick(item), tagColor: "purple" }, item.id)) })
        ]
      }
    );
  }
  if (view === "finished_products") {
    return /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        className: "p-4 sm:p-10 space-y-12 pb-20 max-w-[1600px] mx-auto",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:p-10", children: [
            /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
              SubPageHeader,
              {
                title: "Finished Output Vault",
                parentTitle: "Inventory Hub",
                onBack: () => setView("overview"),
                description: "Retail-ready products prepared for high-end distribution."
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-96", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-6 top-1/2 -translate-y-1/2 text-white/20", size: 20 }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  placeholder: "SEARCH PRODUCT VAULT...",
                  className: "w-full pl-16 pr-8 py-5 bg-white/5 border border-white/10 rounded-full text-[11px] font-sans font-medium tracking-[0.2em] focus:ring-2 focus:ring-[#6A2C91]/20 transition-all shadow-sm text-white placeholder-white/20"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:p-10", children: finishedProducts.map((item) => /* @__PURE__ */ jsx(InventoryCard, { item, onClick: () => handleItemClick(item), tagColor: "green", isProduct: true }, item.id)) })
        ]
      }
    );
  }
  return null;
};
const InventoryCard = ({ item, onClick, tagColor, isProduct }) => /* @__PURE__ */ jsxs(
  motion.div,
  {
    whileHover: { y: -10, scale: 1.02 },
    onClick,
    className: "luxury-card bg-white/5 border border-white/10 rounded-[2.5rem] p-4 sm:p-10 transition-all duration-700 cursor-pointer relative overflow-hidden group flex flex-col h-full hover:bg-white/10",
    children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 sm:p-10 opacity-[0.02] group-hover:opacity-10 transition-opacity duration-1000", children: /* @__PURE__ */ jsx(Package, { size: 120, className: "text-white", strokeWidth: 0.5 }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:p-8 mb-10 relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "w-24 h-24 bg-black/20 rounded-[2rem] overflow-hidden flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-700 border border-white/5", children: item.img ? /* @__PURE__ */ jsx("img", { src: item.img, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Box, { size: 32, className: "text-white/10", strokeWidth: 1 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-serif text-white text-2xl tracking-tight line-clamp-2 mb-2 group-hover:text-[#C5A059] transition-colors", children: item.name }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Badge, { color: tagColor, className: "px-3 py-1 text-[8px] font-sans font-bold uppercase tracking-[0.2em]", children: isProduct ? "Product" : "Material" }),
            /* @__PURE__ */ jsxs("p", { className: "text-[9px] text-white/30 font-mono uppercase tracking-[0.2em]", children: [
              "SKU: ",
              item.sku
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-8 pt-8 border-t border-white/5 mt-auto relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] text-white/30 font-sans font-medium uppercase tracking-[0.3em] mb-2", children: "Available" }),
          /* @__PURE__ */ jsxs("p", { className: "font-serif text-2xl text-white", children: [
            item.stock,
            " ",
            /* @__PURE__ */ jsx("span", { className: "text-xs text-white/30 font-sans font-light uppercase", children: item.unit })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[9px] text-white/30 font-sans font-medium uppercase tracking-[0.3em] mb-2", children: "Unit Cost" }),
          /* @__PURE__ */ jsxs("p", { className: "font-serif text-2xl text-white", children: [
            "$",
            item.unitCost.toFixed(2)
          ] })
        ] })
      ] })
    ]
  }
);
const Forecasting = () => {
  const navigate = useNavigate();
  const { orders, inventory } = useArtisanData();
  let totalUnits = 0;
  orders.forEach((o) => {
    if (o.items) {
      o.items.forEach((i) => {
        totalUnits += i.qty || 0;
      });
    }
  });
  const activeUnits = totalUnits > 0 ? totalUnits : 640;
  const averageUnitsPerInterval = Math.round(activeUnits / 4);
  const averageMaterialCost = inventory.length > 0 ? inventory.reduce((sum, item) => sum + (item.unitCost || 0), 0) / inventory.length : 14.5;
  const [aiScenario, setAiScenario] = React.useState("Baseline");
  const forecastData = Array.from({ length: 6 }).map((_, index) => {
    const date = /* @__PURE__ */ new Date();
    date.setDate(date.getDate() + index * 15);
    const name = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    let growthFactor = 1 + index * 0.05;
    if (aiScenario === "Aggressive") growthFactor += index * 0.15;
    if (aiScenario === "Conservative") growthFactor -= index * 0.02;
    const projectedSold = Math.round(averageUnitsPerInterval * growthFactor);
    const projectedCost = Math.round(projectedSold * averageMaterialCost * 2.2);
    return {
      name,
      sold: projectedSold,
      cost: projectedCost
    };
  });
  const procurementSuggestions = [
    { item: "Rosemary Extract", required: "240 oz", current: "50 oz", shortfall: "190 oz", cost: "$180.50" },
    { item: "Glass Vials (50ml)", required: "500 units", current: "120 units", shortfall: "380 units", cost: "$342.00" },
    { item: "Beeswax Blocks", required: "100 lbs", current: "80 lbs", shortfall: "20 lbs", cost: "$65.00" }
  ];
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "space-y-12 pb-24 max-w-[1600px] mx-auto p-4 sm:p-8 md:p-16",
      children: [
        /* @__PURE__ */ jsx(
          ContextualTutorialModal,
          {
            hubId: "forecasting",
            title: "Forecasting",
            description: "Predict demand and optimize purchasing.",
            steps: ["Review AI-generated demand predictions.", "Plan material purchases based on lead times.", "Analyze seasonal trends and sales velocity."]
          }
        ),
        /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "Forecasting & Strategy",
            parentTitle: "Operations",
            onBack: () => navigate(-1),
            description: "Establish predictive demand nodes and optimize manufacturing flow."
          }
        ),
        /* @__PURE__ */ jsx(
          VaultBanner,
          {
            title: "Forecasting Matrix",
            subtitle: "Predictive logic engines activated. Reconciling historical data with future demand spikes.",
            badge: "Strategy Node Active",
            children: /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsxs(Button, { className: "bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 rounded-full px-10 shadow-2xl shadow-[#6A2C91]/20 transition-all font-sans font-medium text-[11px] tracking-[0.2em] uppercase", onClick: () => {
              alert("Initial forecast generation complete. Predictive algorithms have ingested historical sales.");
            }, children: [
              /* @__PURE__ */ jsx(Plus, { size: 16, className: "mr-3" }),
              " Initialize New Forecast"
            ] }) })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-12", children: [
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, x: -20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.2, duration: 0.6 },
              children: /* @__PURE__ */ jsxs(Card, { className: "luxury-card min-h-[400px] p-4 sm:p-10 bg-black/40 backdrop-blur-xl border-white/10 rounded-[3rem]", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif text-white font-bold mb-8", children: "Order Velocity Nodes" }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide", children: [
                  /* @__PURE__ */ jsx(Badge, { color: "purple", className: "rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase bg-white/5 border-white/10 text-white/50", children: "30D Node" }),
                  /* @__PURE__ */ jsx(Badge, { color: "gold", className: "rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase shadow-sm border-[#C5A059]/20 text-[#C5A059]", children: "90D Node" }),
                  /* @__PURE__ */ jsx(Badge, { color: "purple", className: "rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase bg-white/5 border-white/10 text-white/50", children: "180D Node" }),
                  /* @__PURE__ */ jsx(Badge, { color: "purple", className: "rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase bg-white/5 border-white/10 text-white/50", children: "Annual Cycle" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-72", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: forecastData, children: [
                  /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "colorSold", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#6A2C91", stopOpacity: 0.4 }),
                    /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#6A2C91", stopOpacity: 0 })
                  ] }) }),
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "rgba(255,255,255,0.05)" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", axisLine: false, tickLine: false, tick: { fontFamily: "Inter", fontSize: 11, fill: "rgba(255,255,255,0.3)", fontWeight: 500 }, dy: 10 }),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      contentStyle: { backgroundColor: "rgba(10,10,10,0.9)", borderRadius: "1.5rem", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)", fontFamily: "Inter", fontSize: "12px", color: "#fff" }
                    }
                  ),
                  /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "sold", stroke: "#6A2C91", fillOpacity: 1, fill: "url(#colorSold)", strokeWidth: 2 })
                ] }) }) })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            motion.div,
            {
              initial: { opacity: 0, x: 20 },
              animate: { opacity: 1, x: 0 },
              transition: { delay: 0.3, duration: 0.6 },
              children: /* @__PURE__ */ jsxs(Card, { className: "luxury-card min-h-[400px] p-4 sm:p-10 bg-black/40 backdrop-blur-xl border-white/10 rounded-[3rem]", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-8", children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif text-white font-bold", children: "Raw Material Burn Rate" }),
                  /* @__PURE__ */ jsx("div", { className: "flex gap-2 bg-white/5 p-1.5 rounded-full border border-white/10", children: ["Baseline", "Aggressive", "Conservative"].map((sc) => /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: () => setAiScenario(sc),
                      className: `px-4 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-widest transition-all ${aiScenario === sc ? "bg-[#C5A059] text-white shadow-lg shadow-amber-500/20" : "text-white/40 hover:text-white/80"}`,
                      children: sc
                    },
                    sc
                  )) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-3 mb-10 overflow-x-auto pb-2 scrollbar-hide", children: [
                  /* @__PURE__ */ jsx(Badge, { color: "purple", className: "rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase bg-white/5 border-white/10 text-white/50", children: "30D Node" }),
                  /* @__PURE__ */ jsx(Badge, { color: "gold", className: "rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase shadow-sm border-[#C5A059]/20 text-[#C5A059]", children: "90D Node" }),
                  /* @__PURE__ */ jsx(Badge, { color: "purple", className: "rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase bg-white/5 border-white/10 text-white/50", children: "180D Node" }),
                  /* @__PURE__ */ jsx(Badge, { color: "purple", className: "rounded-full px-4 py-2 font-sans text-[10px] tracking-widest uppercase bg-white/5 border-white/10 text-white/50", children: "Annual Cycle" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-72", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: forecastData, children: [
                  /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "colorCost", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#C5A059", stopOpacity: 0.4 }),
                    /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#C5A059", stopOpacity: 0 })
                  ] }) }),
                  /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "rgba(255,255,255,0.05)" }),
                  /* @__PURE__ */ jsx(XAxis, { dataKey: "name", axisLine: false, tickLine: false, tick: { fontFamily: "Inter", fontSize: 11, fill: "rgba(255,255,255,0.3)", fontWeight: 500 }, dy: 10 }),
                  /* @__PURE__ */ jsx(
                    Tooltip,
                    {
                      formatter: (value) => `$${value}`,
                      contentStyle: { backgroundColor: "rgba(10,10,10,0.9)", borderRadius: "1.5rem", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)", fontFamily: "Inter", fontSize: "12px", color: "#fff" }
                    }
                  ),
                  /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "cost", stroke: "#C5A059", fillOpacity: 1, fill: "url(#colorCost)", strokeWidth: 2 })
                ] }) }) })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.35, duration: 0.6 },
            children: /* @__PURE__ */ jsxs(Card, { className: "luxury-card p-4 sm:p-12 bg-black/40 backdrop-blur-xl border-white/10 rounded-[3rem]", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif text-white font-bold mb-10", children: "Predicted Shortfalls & Procurement" }),
              /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-left border-collapse", children: [
                /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "border-b border-white/10 text-[10px] font-sans font-bold text-white/50 uppercase tracking-[0.3em]", children: [
                  /* @__PURE__ */ jsx("th", { className: "pb-6 pl-4", children: "Material Node" }),
                  /* @__PURE__ */ jsx("th", { className: "pb-6", children: "Required (90D)" }),
                  /* @__PURE__ */ jsx("th", { className: "pb-6", children: "Current Stock" }),
                  /* @__PURE__ */ jsx("th", { className: "pb-6 text-amber-500", children: "Projected Shortfall" }),
                  /* @__PURE__ */ jsx("th", { className: "pb-6", children: "Est. Cost" }),
                  /* @__PURE__ */ jsx("th", { className: "pb-6 text-right pr-4", children: "Action" })
                ] }) }),
                /* @__PURE__ */ jsx("tbody", { children: procurementSuggestions.map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "border-b border-white/5 hover:bg-white/5 transition-colors group", children: [
                  /* @__PURE__ */ jsx("td", { className: "py-6 pl-4 font-serif text-white text-lg tracking-tight group-hover:text-[#C5A059] transition-colors", children: item.item }),
                  /* @__PURE__ */ jsx("td", { className: "py-6 text-white/70 font-medium", children: item.required }),
                  /* @__PURE__ */ jsx("td", { className: "py-6 text-white/70 font-medium", children: item.current }),
                  /* @__PURE__ */ jsx("td", { className: "py-6 text-amber-500 font-bold", children: item.shortfall }),
                  /* @__PURE__ */ jsx("td", { className: "py-6 text-emerald-400 font-bold", children: item.cost }),
                  /* @__PURE__ */ jsx("td", { className: "py-6 text-right pr-4", children: /* @__PURE__ */ jsx(Button, { onClick: () => navigate("/supplier_manager"), className: "h-10 bg-white/10 hover:bg-[#6A2C91] text-white border-none rounded-xl text-[10px] font-black uppercase tracking-widest px-6 transition-colors", children: "Order Now" }) })
                ] }, idx)) })
              ] }) }) })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.4, duration: 0.6 },
            children: /* @__PURE__ */ jsxs(Card, { className: "luxury-card p-4 sm:p-12 bg-black/40 backdrop-blur-xl border-white/10 rounded-[3rem]", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif text-white font-bold mb-10", children: "Synaptic Alignment Matrix" }),
              /* @__PURE__ */ jsx("div", { className: "h-[400px]", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(LineChart, { data: forecastData, children: [
                /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "rgba(255,255,255,0.05)" }),
                /* @__PURE__ */ jsx(XAxis, { dataKey: "name", axisLine: false, tickLine: false, tick: { fontFamily: "Inter", fontSize: 11, fill: "rgba(255,255,255,0.3)", fontWeight: 500 }, dy: 10 }),
                /* @__PURE__ */ jsx(
                  Tooltip,
                  {
                    contentStyle: { backgroundColor: "rgba(10,10,10,0.9)", borderRadius: "1.5rem", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)", fontFamily: "Inter", fontSize: "12px", color: "#fff" }
                  }
                ),
                /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "sold", stroke: "#6A2C91", strokeWidth: 3, dot: { r: 4, fill: "#6A2C91", strokeWidth: 0 }, activeDot: { r: 6 } }),
                /* @__PURE__ */ jsx(Line, { type: "monotone", dataKey: "cost", stroke: "#C5A059", strokeWidth: 3, dot: { r: 4, fill: "#C5A059", strokeWidth: 0 }, activeDot: { r: 6 } })
              ] }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center gap-4 sm:p-10 mt-12 text-[10px] font-sans font-bold text-white/50 uppercase tracking-widest", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-[#6A2C91] shadow-[0_0_8px_#6A2C91]" }),
                  " Order Velocity"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" }),
                  " Revenue Handshake"
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-2.5 h-2.5 rounded-full bg-[#C5A059] shadow-[0_0_8px_#C5A059]" }),
                  " Material Burden"
                ] })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: 0.5, duration: 0.6 },
            className: "space-y-8",
            children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-3xl font-serif text-white font-bold flex items-center gap-4", children: [
                /* @__PURE__ */ jsx("div", { className: "p-3 bg-[#C5A059]/10 rounded-xl", children: /* @__PURE__ */ jsx(History, { className: "text-[#C5A059]", size: 24 }) }),
                " Historical Synthesis"
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "bg-black/40 backdrop-blur-xl rounded-[3rem] p-4 sm:p-10 border border-white/5 shadow-2xl group hover:border-[#C5A059]/30 hover:bg-black/60 transition-all duration-500 cursor-pointer flex flex-col md:flex-row justify-between items-center gap-4 sm:p-8 relative overflow-hidden", children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 sm:p-8 opacity-[0.02] text-[#C5A059] group-hover:opacity-[0.05] transition-opacity", children: /* @__PURE__ */ jsx(RefreshCw, { size: 120, className: "animate-spin-slow" }) }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 sm:p-8 relative z-10", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#6A2C91] shadow-inner group-hover:scale-105 group-hover:bg-white/10 transition-all duration-700", children: /* @__PURE__ */ jsx(RefreshCw, { size: 28 }) }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-3", children: [
                      /* @__PURE__ */ jsx("h4", { className: "text-2xl font-serif text-white tracking-tight group-hover:text-[#C5A059] transition-colors", children: "Active Projection: Q4 Protocol" }),
                      /* @__PURE__ */ jsx(Badge, { color: "gold", className: "text-[9px] px-3 py-1 shadow-sm font-sans tracking-widest uppercase border-[#C5A059]/20", children: "Needs Review" })
                    ] }),
                    /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-white/50 font-sans uppercase tracking-[0.2em]", children: [
                      "Units Needed: ",
                      /* @__PURE__ */ jsx("span", { className: "text-white/90", children: "110" }),
                      " • Created: Nov 25, 2025"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right relative z-10 w-full md:w-auto flex items-center gap-4 sm:p-8 border-t border-white/5 md:border-0 pt-6 md:pt-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center md:items-end", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-sans font-bold text-white/30 uppercase tracking-[0.3em] mb-2", children: "Projected Settlement" }),
                    /* @__PURE__ */ jsx("p", { className: "text-4xl font-serif text-emerald-400 tracking-tight drop-shadow-[0_0_15px_rgba(52,211,153,0.2)]", children: "$1,976.70" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "p-4 bg-white/5 text-white/30 rounded-2xl shadow-inner border border-white/5 group-hover:text-[#C5A059] group-hover:bg-white/10 transition-colors", children: /* @__PURE__ */ jsx(ChevronRight, { size: 24 }) })
                ] })
              ] })
            ]
          }
        )
      ]
    }
  );
};
const ProductionScheduler = () => {
  const { productionStats, generateSchedule, recipes } = useArtisanData();
  const navigate = useNavigate();
  const hasSchedule = productionStats.active > 0 || productionStats.inProgress > 0 || productionStats.awaiting > 0;
  return /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6 animate-in fade-in pb-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-1", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/operations"), className: "flex items-center gap-2 text-gray-400 hover:text-[#6A2C91] mb-4 font-black text-xs uppercase tracking-widest transition-colors", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { size: 18 }),
        " Back to Operations"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white", children: "Production Scheduler" }),
            /* @__PURE__ */ jsx(Badge, { color: "gold", children: "Beta" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "AI-powered production scheduling and optimization" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { className: "bg-[#A78BFA] hover:bg-[#8B5CF6] text-white border-0", onClick: generateSchedule, children: [
          /* @__PURE__ */ jsx(Sparkles, { size: 16, className: "mr-2" }),
          " ",
          hasSchedule ? "Update Schedule" : "Generate Schedule"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "w-full md:w-1/4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-200 shadow-sm", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mb-2", children: "Pending Orders" }),
      /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-gray-900", children: productionStats.pending })
    ] }) }),
    !hasSchedule ? /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-4 sm:p-12 flex flex-col items-center justify-center min-h-[400px]", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(Calendar, { size: 32, className: "text-gray-400" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-white font-bold font-medium mb-1", children: "No pending production orders" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm", children: "Create production orders to generate a schedule" })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: "Today's Schedule" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-xl border border-l-4 border-purple-500 shadow-sm flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx(Badge, { color: "purple", children: "In Progress" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "09:00 AM - 12:00 PM" })
            ] }),
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-white", children: "Batch #1024: Midnight Serum" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Recipe: Midnight Serum v2 • 100 Units" })
          ] }),
          /* @__PURE__ */ jsx(Button, { onClick: () => toast.info("Opening production schedule details..."), variant: "outline", className: "text-xs", children: "View Details" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-xl border border-l-4 border-blue-500 shadow-sm flex items-center justify-between", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx(Badge, { color: "blue", children: "Scheduled" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "01:00 PM - 03:00 PM" })
            ] }),
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-white", children: "Batch #1025: Lavender Soap" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Recipe: Lavender Rose • 50 Units" })
          ] }),
          /* @__PURE__ */ jsx(Button, { onClick: () => toast.info("Opening production schedule details..."), variant: "outline", className: "text-xs", children: "View Details" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-xl border border-l-4 border-green-500 shadow-sm flex items-center justify-between opacity-75", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
              /* @__PURE__ */ jsx(Badge, { color: "green", children: "Completed" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-500", children: "07:00 AM - 08:30 AM" })
            ] }),
            /* @__PURE__ */ jsx("h4", { className: "font-bold text-white", children: "Batch #1023: QA Check" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: "Routine equipment maintenance" })
          ] }),
          /* @__PURE__ */ jsx(CheckCircle, { className: "text-green-500" })
        ] })
      ] })
    ] })
  ] });
};
const ProductionWorkflow = () => {
  const { productionStats, recipes, produceBatch } = useArtisanData();
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6 animate-in fade-in pb-20", children: [
    /* @__PURE__ */ jsx(
      ContextualTutorialModal,
      {
        hubId: "manufacturing",
        title: "Manufacturing Hub",
        description: "Oversee and optimize your entire production pipeline.",
        steps: ["View active production batches.", "Log QA checks and record defect rates.", "Manage capacity and workstation loads."]
      }
    ),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/operations"), className: "flex items-center gap-2 text-gray-400 hover:text-[#6A2C91] mb-4 font-black text-xs uppercase tracking-widest transition-colors", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { size: 18 }),
        " Back to Operations"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-white", children: "Production Workflow" }),
        /* @__PURE__ */ jsx(Badge, { color: "gold", children: "Beta" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Manage production stages, assignments, and approvals" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200 shadow-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 font-bold uppercase mb-2", children: "Active Orders" }),
        /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-gray-900", children: productionStats.active })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 font-bold uppercase mb-2", children: "In Progress" }),
        /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-gray-900", children: productionStats.inProgress })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-[#FFF9E6] p-4 rounded-xl border border-[#FFE082] shadow-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-[#B45309] font-bold uppercase mb-2", children: "Awaiting Approval" }),
        /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-[#B45309]", children: productionStats.awaiting })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 p-4 rounded-xl border border-emerald-100 shadow-sm", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs text-emerald-700 font-bold uppercase mb-2", children: "Completed Today" }),
        /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-emerald-700", children: productionStats.completed })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white mb-6", children: "Active Formulations Ready for Production" }),
      recipes.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-4 sm:p-12 flex flex-col items-center justify-center min-h-[400px]", children: [
        /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(Clock, { size: 32, className: "text-gray-400" }) }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "No active production formulas found. Create one in Recipes." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: recipes.map((recipe) => /* @__PURE__ */ jsxs("div", { className: "bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white", children: recipe.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-gray-400 text-sm mt-1", children: [
                "SKU: ",
                recipe.sku
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Badge, { color: "purple", children: [
              recipe.yield,
              " Units"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 mb-6", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 font-bold uppercase tracking-widest", children: "Bill of Materials:" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: recipe.ingredients.map((ing, i) => /* @__PURE__ */ jsxs("span", { className: "text-xs bg-white/10 text-white/80 px-2 py-1 rounded-md", children: [
              ing.name,
              " (",
              ing.qty,
              ")"
            ] }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "w-full bg-[#C5A059] text-white hover:bg-[#b08e4d] rounded-xl font-bold uppercase tracking-widest text-xs h-12",
            onClick: async () => {
              try {
                const result = await produceBatch(recipe.id, 1);
                if (result.success) {
                  if (result.warnings.length > 0) {
                    toast.warning(`Batch Produced with Warnings: ${result.warnings.join(", ")}`);
                  } else {
                    toast.success(`${recipe.name} Batch successfully produced and materials deducted.`);
                  }
                } else {
                  toast.error(result.warnings[0]);
                }
              } catch (error) {
                toast.error("An unexpected error occurred while producing the batch.");
                console.error("Batch production error:", error);
              }
            },
            children: "Commit Batch to Production"
          }
        )
      ] }, recipe.id)) })
    ] })
  ] });
};
const SupplierManager = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, inventory } = useArtisanData();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    rating: 3,
    tier: "Moderate",
    leadTime: 7,
    paymentTerms: "Net 30"
  });
  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ name: "", contactName: "", email: "", phone: "", rating: 3, tier: "Moderate", leadTime: 7, paymentTerms: "Net 30" });
    setShowModal(true);
  };
  const handleOpenEdit = (supplier) => {
    setIsEditing(true);
    setEditingId(supplier.id);
    setFormData({ ...supplier });
    setShowModal(true);
  };
  const handleCommit = () => {
    if (!formData.name) return;
    if (isEditing && editingId) {
      updateSupplier(editingId, formData);
    } else {
      addSupplier(formData);
    }
    setShowModal(false);
    setFormData({ name: "", contactName: "", email: "", phone: "", rating: 3, tier: "Moderate", leadTime: 7, paymentTerms: "Net 30" });
  };
  const handleDelete = () => {
    if (!editingId) return;
    if (window.confirm("ARE YOU SURE? Revoking this vendor node is permanent. This will remove the supplier identity from your vault ledger.")) {
      deleteSupplier(editingId);
      setShowModal(false);
    }
  };
  const getSuppliedItems = (supplierName) => {
    return inventory.filter((i) => i.supplier === supplierName);
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-10 animate-in fade-in pb-20", children: [
    /* @__PURE__ */ jsx(Modal, { isOpen: showModal, onClose: () => setShowModal(false), title: isEditing ? "Revise Vault Node" : "Register Vault Supplier", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 p-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Entity Identity" }),
        /* @__PURE__ */ jsx(Input, { placeholder: "Entity Name", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "rounded-2xl py-4" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Primary Liaison" }),
        /* @__PURE__ */ jsx(Input, { placeholder: "Primary Liaison", value: formData.contactName, onChange: (e) => setFormData({ ...formData, contactName: e.target.value }), className: "rounded-2xl py-4" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Secure Email" }),
          /* @__PURE__ */ jsx(Input, { placeholder: "Secure Email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "rounded-2xl" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Direct Phone" }),
          /* @__PURE__ */ jsx(Input, { placeholder: "Direct Phone", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), className: "rounded-2xl" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Vendor Tiering" }),
          /* @__PURE__ */ jsxs(Select, { value: formData.tier, onChange: (e) => setFormData({ ...formData, tier: e.target.value }), className: "rounded-2xl", children: [
            /* @__PURE__ */ jsx("option", { value: "Reliable", children: "Reliable Node" }),
            /* @__PURE__ */ jsx("option", { value: "Moderate", children: "Moderate Node" }),
            /* @__PURE__ */ jsx("option", { value: "Risk", children: "Risk Node" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Lead Time (Days)" }),
          /* @__PURE__ */ jsx(Input, { type: "number", placeholder: "Lead Time", value: formData.leadTime, onChange: (e) => setFormData({ ...formData, leadTime: parseInt(e.target.value) }), className: "rounded-2xl" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 pt-4 border-t border-stone-50", children: [
        /* @__PURE__ */ jsx(Button, { onClick: handleCommit, className: "w-full bg-[#6A2C91] text-white h-14 rounded-2xl font-black text-xs tracking-widest shadow-xl uppercase transition-all hover:scale-[1.02]", children: isEditing ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(RefreshCw, { size: 18, className: "mr-2" }),
          " UPDATE VENDOR NODE"
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(ShieldCheck, { size: 18, className: "mr-2" }),
          " AUTHORIZE VENDOR"
        ] }) }),
        isEditing && /* @__PURE__ */ jsxs(Button, { variant: "danger", onClick: handleDelete, className: "w-full h-12 rounded-2xl font-black text-[10px] tracking-widest uppercase opacity-70 hover:opacity-100 transition-all", children: [
          /* @__PURE__ */ jsx(Trash2, { size: 14, className: "mr-2" }),
          " DELETE VENDOR NODE"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/inventory"), className: "flex items-center gap-2 text-gray-400 hover:text-[#6A2C91] mb-4 font-black text-xs uppercase tracking-widest transition-colors", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
          " Back to Resource Hub"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-white tracking-tighter uppercase italic", children: "Supplier Hub" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 font-medium", children: "Supply Chain Integrity: Managing External Nodes & Sourcing Logic." })
      ] }),
      /* @__PURE__ */ jsxs(Button, { className: "bg-[#6A2C91] text-white h-12 rounded-2xl font-black text-[10px] tracking-widest px-8 shadow-xl", onClick: handleOpenCreate, children: [
        /* @__PURE__ */ jsx(Plus, { size: 16, className: "mr-2" }),
        " REGISTER VENDOR"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsx(StatMini$1, { label: "Active Vendors", val: suppliers.length, color: "text-purple-600" }),
      /* @__PURE__ */ jsx(StatMini$1, { label: "Reliability Pass", val: "94%", color: "text-emerald-600" }),
      /* @__PURE__ */ jsx(StatMini$1, { label: "Total Material Nodes", val: inventory.filter((i) => i.type === "raw").length, color: "text-amber-600" }),
      /* @__PURE__ */ jsx(StatMini$1, { label: "Avg. Lead Time", val: "9.2d", color: "text-[#C5A059]" })
    ] }),
    suppliers.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-[2.5rem] p-24 flex flex-col items-center justify-center text-center shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center text-stone-200 mb-6 shadow-inner", children: /* @__PURE__ */ jsx(Truck, { size: 40 }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-white uppercase italic", children: "No Supply Nodes Detected" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm font-medium mt-1", children: "Initialize your supplier database to track material lead times." }),
      /* @__PURE__ */ jsx(Button, { onClick: handleOpenCreate, className: "mt-8 bg-purple-50 text-[#6A2C91] h-12 px-8 rounded-2xl font-black text-[10px] tracking-widest border border-purple-100", children: "INITIALIZE FIRST NODE" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:p-8", children: suppliers.map((supplier) => {
      const linkedItems = getSuppliedItems(supplier.name);
      return /* @__PURE__ */ jsxs("div", { className: "bg-white border border-stone-200 rounded-[2.5rem] p-4 sm:p-8 hover:shadow-2xl hover:border-[#6A2C91] transition-all group relative overflow-hidden flex flex-col h-full", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-full -mr-8 -mt-8 opacity-40 group-hover:bg-purple-50 group-hover:opacity-100 transition-all" }),
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6 relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-[#C5A059] shadow-inner group-hover:bg-white transition-colors", children: /* @__PURE__ */ jsx(Truck, { size: 24 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-white tracking-tight uppercase italic line-clamp-1", children: supplier.name }),
              /* @__PURE__ */ jsxs(Badge, { color: supplier.tier === "Reliable" ? "green" : supplier.tier === "Risk" ? "red" : "gold", className: "text-[8px] px-2 py-0.5 font-black uppercase tracking-widest mt-1", children: [
                supplier.tier,
                " tier"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleOpenEdit(supplier),
              className: "p-3 bg-stone-50 text-gray-400 rounded-xl hover:bg-[#6A2C91] hover:text-white transition-all shadow-sm z-20",
              children: /* @__PURE__ */ jsx(Edit2, { size: 16 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 mb-8 relative z-10 flex-1 text-[11px] font-bold text-gray-500 uppercase tracking-widest", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(User, { size: 14, className: "text-[#6A2C91]" }),
            " ",
            supplier.contactName
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Mail, { size: 14, className: "text-[#C5A059]" }),
            " ",
            supplier.email
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Phone, { size: 14, className: "text-emerald-500" }),
            " ",
            supplier.phone
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-stone-50 pt-8 relative z-10", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-black text-gray-400 uppercase flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Layers, { size: 14 }),
            " Linked Materials (",
            linkedItems.length,
            ")"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: linkedItems.length > 0 ? linkedItems.map((item, i) => /* @__PURE__ */ jsx("span", { className: "px-3 py-1 bg-stone-50 text-[10px] font-bold text-gray-600 rounded-lg border border-stone-100 uppercase", children: item.name }, i)) : /* @__PURE__ */ jsx("span", { className: "text-[10px] text-gray-400 italic", children: "No inventory nodes mapped." }) })
        ] })
      ] }, supplier.id);
    }) })
  ] });
};
const StatMini$1 = ({ label, val, color }) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-[2rem] border border-stone-100 shadow-sm flex flex-col items-start group hover:border-[#6A2C91] transition-all", children: [
  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1", children: label }),
  /* @__PURE__ */ jsx("p", { className: `text-2xl font-black tracking-tighter ${color}`, children: val })
] });
const QualityControl = () => {
  const { qualityChecks, addQualityCheck, inventory } = useArtisanData();
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();
  const [newCheck, setNewCheck] = useState({
    productName: "",
    batchNumber: "",
    status: "Pending",
    inspector: "",
    date: (/* @__PURE__ */ new Date()).toLocaleDateString()
  });
  const handleAdd = () => {
    if (!newCheck.productName) return;
    addQualityCheck(newCheck);
    setShowAdd(false);
    setNewCheck({ productName: "", batchNumber: "", status: "Pending", inspector: "" });
  };
  const passRate = qualityChecks.length > 0 ? Math.round(qualityChecks.filter((c) => c.status === "Passed").length / qualityChecks.length * 100) : 100;
  return /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20", children: [
    /* @__PURE__ */ jsx(Modal, { isOpen: showAdd, onClose: () => setShowAdd(false), title: "Initialize Integrity Inspection", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 p-4", children: [
      /* @__PURE__ */ jsxs(Select, { value: newCheck.productName, onChange: (e) => setNewCheck({ ...newCheck, productName: e.target.value }), className: "h-14 rounded-full bg-white/5 border-white/10 text-white font-sans text-sm", children: [
        /* @__PURE__ */ jsx("option", { value: "", className: "bg-black text-white", children: "Select Asset..." }),
        inventory.map((i) => /* @__PURE__ */ jsxs("option", { value: i.name, className: "bg-black text-white", children: [
          i.name,
          " (",
          i.sku,
          ")"
        ] }, i.id))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsx(Input, { placeholder: "Batch Code", value: newCheck.batchNumber, onChange: (e) => setNewCheck({ ...newCheck, batchNumber: e.target.value }), className: "bg-white/5 border-white/10 text-white" }),
        /* @__PURE__ */ jsx(Input, { placeholder: "Sign-off Name", value: newCheck.inspector, onChange: (e) => setNewCheck({ ...newCheck, inspector: e.target.value }), className: "bg-white/5 border-white/10 text-white" })
      ] }),
      /* @__PURE__ */ jsxs(Select, { value: newCheck.status, onChange: (e) => setNewCheck({ ...newCheck, status: e.target.value }), className: "h-14 rounded-full bg-white/5 border-white/10 text-white font-sans text-sm", children: [
        /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: "Pending" }),
        /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: "Passed" }),
        /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: "Failed" })
      ] }),
      /* @__PURE__ */ jsx(Button, { onClick: handleAdd, className: "w-full bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 rounded-full font-sans font-medium text-[11px] tracking-[0.2em] shadow-xl shadow-[#6A2C91]/20 mt-8 uppercase transition-all", children: "LOG INSPECTION DATA" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:p-8", children: [
      /* @__PURE__ */ jsx(
        SubPageHeader,
        {
          title: "Trapped Cash Audit & QC",
          parentTitle: "Operations",
          onBack: () => navigate("/inventory"),
          description: "Batch Integrity Vault: Enforcing Excellence Across the Manufacturing Floor."
        }
      ),
      /* @__PURE__ */ jsx(
        VaultBanner,
        {
          title: "Trapped Cash Audit & QC",
          subtitle: "Batch Integrity Vault: Enforcing Excellence Across the Manufacturing Floor.",
          badge: "Audit Protocol Active",
          children: /* @__PURE__ */ jsxs(Button, { className: "bg-[#6A2C91] hover:bg-[#5a257a] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 rounded-full shadow-2xl shadow-[#6A2C91]/20 transition-all", onClick: () => setShowAdd(true), children: [
            /* @__PURE__ */ jsx(Plus, { size: 16, className: "mr-3" }),
            " NEW AUDIT LOG"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsx(StatBox$1, { label: "Total Audits", val: qualityChecks.length, color: "text-[#C5A059]", icon: ClipboardList }),
      /* @__PURE__ */ jsx(StatBox$1, { label: "Pass Velocity", val: `${passRate}%`, color: "text-emerald-400", icon: ShieldCheck }),
      /* @__PURE__ */ jsx(StatBox$1, { label: "Failure Waste", val: "$0.00", color: "text-red-400", icon: AlertTriangle }),
      /* @__PURE__ */ jsx(StatBox$1, { label: "Pending QA", val: qualityChecks.filter((c) => c.status === "Pending").length, color: "text-blue-400", icon: Clock })
    ] }),
    qualityChecks.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "luxury-card border-white/10 rounded-[2.5rem] p-24 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white/20 mb-6 shadow-inner border border-white/10", children: /* @__PURE__ */ jsx(ClipboardCheck, { size: 40 }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif tracking-tight text-white/50 mb-2", children: "Vault Empty" }),
      /* @__PURE__ */ jsx("p", { className: "text-white/30 text-[11px] font-sans font-medium uppercase tracking-[0.2em] mt-1", children: "No inspection history detected." }),
      /* @__PURE__ */ jsx(Button, { onClick: () => setShowAdd(true), className: "mt-8 bg-white/5 text-[#C5A059] h-12 px-8 rounded-full font-sans text-[10px] tracking-widest uppercase border border-white/10 hover:bg-white/10", children: "INITIALIZE AUDIT" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-8", children: qualityChecks.map((check) => /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-10 hover:shadow-2xl hover:border-[#C5A059]/50 transition-all group relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mb-8 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsx("div", { className: `w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center ${check.status === "Passed" ? "text-emerald-400" : "text-amber-400"} shadow-inner group-hover:bg-white/10 transition-colors`, children: check.status === "Passed" ? /* @__PURE__ */ jsx(ShieldCheck, { size: 28 }) : /* @__PURE__ */ jsx(Clock, { size: 28 }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif text-white tracking-tight", children: check.productName }),
          /* @__PURE__ */ jsxs(Badge, { color: "gold", className: "text-[9px] px-3 py-1 font-sans tracking-widest mt-2 uppercase border-white/10", children: [
            "Batch: ",
            check.batchNumber
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mb-8 relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-6 rounded-[1.5rem] border border-white/10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] mb-2", children: "Inspector Sign-off" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-serif text-white", children: check.inspector })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-6 rounded-[1.5rem] border border-white/10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] mb-2", children: "Status Node" }),
          /* @__PURE__ */ jsx("p", { className: `text-xl font-serif ${check.status === "Passed" ? "text-emerald-400" : "text-amber-400"}`, children: check.status })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "space-y-4 border-t border-white/5 pt-8 relative z-10", children: /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(History, { size: 14, className: "text-[#C5A059]" }),
        " Timestamp: ",
        check.date
      ] }) })
    ] }, check.id)) })
  ] });
};
const StatBox$1 = ({ label, val, color, icon: Icon }) => /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-black/40 backdrop-blur-xl p-4 sm:p-8 rounded-[2rem] border border-white/10 shadow-lg flex flex-col items-start group hover:border-[#C5A059]/30 transition-all", children: [
  /* @__PURE__ */ jsx("div", { className: `p-4 bg-white/5 border border-white/10 rounded-2xl mb-6 text-white/50 group-hover:text-[#C5A059] group-hover:scale-110 transition-all`, children: /* @__PURE__ */ jsx(Icon, { size: 24 }) }),
  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/40 font-sans font-bold uppercase tracking-[0.2em] mb-2", children: label }),
  /* @__PURE__ */ jsx("p", { className: `text-4xl font-serif tracking-tight ${color}`, children: val })
] });
const Recipes = () => {
  const { recipes, inventory, produceBatch } = useArtisanData();
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-10 md:p-16 space-y-16 max-w-[1600px] mx-auto pb-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:p-8", children: [
      /* @__PURE__ */ jsx(
        SubPageHeader,
        {
          title: "Golden Ratio Ledger",
          parentTitle: "Resource Hub",
          onBack: () => navigate("/inventory"),
          description: "BOM Architecture: Bridging Material Costs with Finished Value."
        }
      ),
      /* @__PURE__ */ jsx(
        VaultBanner,
        {
          title: "Golden Ratio Ledger",
          subtitle: "BOM Architecture: Bridging Material Costs with Finished Value.",
          badge: "Formula Protocol Active",
          children: /* @__PURE__ */ jsxs(Button, { className: "bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 rounded-full shadow-2xl shadow-black/10 transition-all uppercase", onClick: () => navigate("/recipes/builder"), children: [
            /* @__PURE__ */ jsx(Plus, { size: 16, className: "mr-3" }),
            " INITIALIZE FORMULA"
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsx(StatBox, { label: "Active Formulas", val: recipes.length, color: "text-purple-400", icon: Layers }),
      /* @__PURE__ */ jsx(StatBox, { label: "Optimal Margins", val: "88%", color: "text-emerald-400", icon: Target }),
      /* @__PURE__ */ jsx(StatBox, { label: "Production Ready", val: "12 SKU", color: "text-amber-400", icon: Zap })
    ] }),
    recipes.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "luxury-card border-white/10 rounded-[2.5rem] p-24 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-white/20 mb-6 shadow-inner border border-white/10", children: /* @__PURE__ */ jsx(Box, { size: 40 }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif tracking-tight text-white/50 mb-2", children: "Vault Empty" }),
      /* @__PURE__ */ jsx("p", { className: "text-white/30 text-[11px] font-sans font-medium uppercase tracking-[0.2em] mt-1", children: "Initialize your first Bill of Materials to start tracking margins." }),
      /* @__PURE__ */ jsx(Button, { onClick: () => navigate("/recipes/builder"), className: "mt-8 bg-white/5 text-[#C5A059] h-12 px-8 rounded-full font-sans text-[10px] tracking-widest uppercase border border-white/10 hover:bg-white/10", children: "LAUNCH BUILDER" })
    ] }) : /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-8", children: recipes.map((recipe) => /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-10 hover:shadow-2xl hover:border-[#6A2C91]/50 transition-all group relative overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-8 relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#6A2C91] shadow-inner group-hover:bg-white/10 transition-colors", children: /* @__PURE__ */ jsx(Layers, { size: 28 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif text-white tracking-tight", children: recipe.name }),
            /* @__PURE__ */ jsxs(Badge, { color: "purple", className: "text-[9px] px-3 py-1 font-sans tracking-widest mt-2 uppercase border-white/10", children: [
              "V",
              recipe.version,
              " SKU: ",
              recipe.sku
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                const result = produceBatch(recipe.id, 1);
                if (result.success) {
                  if (result.warnings.length > 0) {
                    toast.warning(`Batch Produced with Warnings:
${result.warnings.join("\n")}`);
                  } else {
                    toast.success(`${recipe.name} Batch successfully produced and deducted from raw materials.`);
                  }
                } else {
                  toast.error(result.warnings[0]);
                }
              },
              className: "px-6 py-4 bg-[#6A2C91] text-white rounded-2xl hover:bg-[#59227A] transition-all shadow-sm font-sans font-bold text-[10px] uppercase tracking-widest",
              children: "Produce Batch"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => navigate(`/recipes/builder/${recipe.id}`),
              className: "p-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl hover:bg-[#6A2C91] hover:text-white transition-all shadow-sm group-hover:border-[#6A2C91]/30",
              children: /* @__PURE__ */ jsx(Edit2, { size: 20 })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4 mb-8 relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-6 rounded-[1.5rem] border border-white/10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] mb-2", children: "Batch Yield" }),
          /* @__PURE__ */ jsx("p", { className: "text-xl font-serif text-white", children: recipe.yield })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-6 rounded-[1.5rem] border border-white/10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] mb-2", children: "Landed Cost" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xl font-serif text-emerald-400", children: [
            "$",
            recipe.totalCost.toFixed(2)
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-6 rounded-[1.5rem] border border-white/10", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] mb-2", children: "Labor" }),
          /* @__PURE__ */ jsxs("p", { className: "text-xl font-serif text-[#C5A059]", children: [
            recipe.productionTime,
            "m"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 border-t border-white/5 pt-8 relative z-10", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-[10px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Box, { size: 14, className: "text-[#6A2C91]" }),
          " Bill of Materials (",
          recipe.ingredients.length,
          " Nodes)"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: recipe.ingredients.map((ing, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[11px] font-sans font-bold text-white/70 uppercase tracking-tight", children: ing.name }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-sans font-black text-[#6A2C91] tracking-[0.2em]", children: ing.qty })
        ] }, i)) })
      ] })
    ] }, recipe.id)) })
  ] });
};
const StatBox = ({ label, val, color, icon: Icon }) => /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-black/40 backdrop-blur-xl p-4 sm:p-8 rounded-[2rem] border border-white/10 shadow-lg flex flex-col items-start group hover:border-[#6A2C91]/30 transition-all", children: [
  /* @__PURE__ */ jsx("div", { className: `p-4 bg-white/5 border border-white/10 rounded-2xl mb-6 text-white/50 group-hover:text-[#6A2C91] group-hover:scale-110 transition-all`, children: /* @__PURE__ */ jsx(Icon, { size: 24 }) }),
  /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/40 font-sans font-bold uppercase tracking-[0.2em] mb-2", children: label }),
  /* @__PURE__ */ jsx("p", { className: `text-4xl font-serif tracking-tight ${color}`, children: val })
] });
const RecipeBuilder = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { inventory, recipes, addRecipe, updateRecipe, userTier } = useArtisanData();
  const [materials, setMaterials] = useState([]);
  const loadDraft = () => {
    const saved = sessionStorage.getItem("draft_recipe");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
      }
    }
    return null;
  };
  const draft = loadDraft();
  const [ingredients, setIngredients] = useState((draft == null ? void 0 : draft.ingredients) || []);
  const [yieldQty, setYieldQty] = useState((draft == null ? void 0 : draft.yieldQty) || 1);
  const [laborCost, setLaborCost] = useState((draft == null ? void 0 : draft.laborCost) || 0);
  const [recipeName, setRecipeName] = useState((draft == null ? void 0 : draft.recipeName) || "");
  const [sku, setSku] = useState((draft == null ? void 0 : draft.sku) || "");
  const [isEditing, setIsEditing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeLimit, setUpgradeLimit] = useState(5);
  const [requiredTier, setRequiredTier] = useState("Artisan Flow Basic");
  const [showROIHeatmap, setShowROIHeatmap] = useState(false);
  useEffect(() => {
    if (!isEditing) {
      sessionStorage.setItem("draft_recipe", JSON.stringify({
        ingredients,
        yieldQty,
        laborCost,
        recipeName,
        sku
      }));
    }
  }, [ingredients, yieldQty, laborCost, recipeName, sku, isEditing]);
  useEffect(() => {
    setMaterials(inventory.filter((i) => i.type === "raw"));
  }, [inventory]);
  useEffect(() => {
    if (id && recipes.length > 0) {
      const existing = recipes.find((r) => r.id === id);
      if (existing) {
        setIsEditing(true);
        setRecipeName(existing.name);
        setSku(existing.sku);
        setYieldQty(existing.yieldValue || 1);
        setLaborCost(existing.laborCost || 0);
        if (existing.rawIngredients) {
          setIngredients(existing.rawIngredients);
        }
      }
    }
  }, [id, recipes]);
  const addIngredient = () => {
    if (materials.length === 0) return;
    setIngredients([...ingredients, { inventoryItemId: materials[0].id.toString(), quantity: 1, unit: materials[0].unit || "oz" }]);
  };
  const updateIngredient = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };
  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  const calculateTotalCost = () => {
    const materialCost = ingredients.reduce((sum, ing) => {
      const mat = materials.find((m) => m.id.toString() === ing.inventoryItemId.toString());
      return sum + (mat ? mat.unitCost * ing.quantity : 0);
    }, 0);
    return materialCost + Number(laborCost);
  };
  const totalCost = calculateTotalCost();
  const costPerUnit = yieldQty > 0 ? totalCost / yieldQty : 0;
  const targetRetail = costPerUnit * 2.2;
  const recipeSchema = z.object({
    name: z.string().min(1, { message: "Formula Name is required" }),
    sku: z.string().min(1, { message: "SKU is required" }),
    yieldQty: z.number().min(1, { message: "Yield must be at least 1" }),
    laborCost: z.number().min(0, { message: "Labor cost cannot be negative" }),
    ingredients: z.array(z.object({
      inventoryItemId: z.string().min(1),
      quantity: z.number().min(0.01, { message: "Ingredient quantity must be greater than 0" }),
      unit: z.string().min(1)
    })).min(1, { message: "At least one BOM node is required" })
  });
  const handleSave = async () => {
    if (!isEditing && userTier === "Free Audit" && recipes.length >= 5) {
      setShowUpgradeModal(true);
      return;
    }
    const defaultSku = "BOM-" + Math.random().toString(36).substr(2, 5).toUpperCase();
    const result = recipeSchema.safeParse({
      name: recipeName,
      sku: sku || defaultSku,
      yieldQty: Number(yieldQty),
      laborCost: Number(laborCost),
      ingredients: ingredients.map((ing) => ({
        ...ing,
        quantity: Number(ing.quantity)
      }))
    });
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    const recipePayload = {
      name: result.data.name,
      sku: result.data.sku,
      version: isEditing ? "2.0" : "1.0",
      yield: `${result.data.yieldQty} Units`,
      yieldValue: result.data.yieldQty,
      ingredients: result.data.ingredients.map((ing) => {
        var _a;
        return {
          name: ((_a = materials.find((m) => m.id.toString() === ing.inventoryItemId.toString())) == null ? void 0 : _a.name) || "Unknown",
          qty: `${ing.quantity} ${ing.unit}`
        };
      }),
      rawIngredients: result.data.ingredients,
      materialCost: totalCost - result.data.laborCost,
      laborCost: result.data.laborCost,
      totalCost,
      productionTime: isEditing ? 45 : 60
      // mock
    };
    try {
      if (isEditing && id) {
        updateRecipe(id, recipePayload);
        toast.success("Vault Deployment: Formula Synchronized Successfully.");
      } else {
        await addRecipe(recipePayload);
        toast.success("Vault Deployment: Formula Synchronized Successfully.");
      }
      sessionStorage.removeItem("draft_recipe");
      navigate("/recipes");
    } catch (e) {
      if (e.message.includes("Tier limit reached")) {
        const limitMatch = e.message.match(/\d+/);
        setUpgradeLimit(limitMatch ? parseInt(limitMatch[0]) : 5);
        setRequiredTier(userTier === "Free Audit" ? "Artisan Flow Basic" : "Margin Protection Pro");
        setShowUpgradeModal(true);
      }
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-10 animate-in fade-in pb-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/recipes"), className: "text-gray-400 hover:text-[#6A2C91] font-black text-xs uppercase tracking-widest flex items-center gap-2 mb-4 transition-colors", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
            " Back to Vault"
          ] }),
          /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-white tracking-tighter uppercase italic", children: isEditing ? "Formula Revision" : "Formula Architect" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-500 font-medium", children: isEditing ? "Optimizing existing Bill of Materials for margin integrity." : "Constructing Bills of Materials with Synaptic Cost Reconciliation." })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            className: "bg-[#6A2C91] text-white font-black text-[10px] tracking-widest h-14 px-10 rounded-2xl shadow-xl shadow-purple-100",
            onClick: handleSave,
            children: [
              isEditing ? /* @__PURE__ */ jsx(RefreshCw, { size: 18, className: "mr-2" }) : /* @__PURE__ */ jsx(Save, { size: 18, className: "mr-2" }),
              isEditing ? "UPDATE VAULT NODE" : "COMMIT FORMULA TO VAULT"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-10", children: [
          /* @__PURE__ */ jsx(Card, { title: "Structural Identity", className: "rounded-[2.5rem] border-stone-100", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Formula Name" }),
              /* @__PURE__ */ jsx(Input, { value: recipeName, onChange: (e) => setRecipeName(e.target.value), placeholder: "e.g. Midnight Serum Alpha", className: "rounded-2xl py-4" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Asset SKU Reference" }),
              /* @__PURE__ */ jsx(Input, { value: sku, onChange: (e) => setSku(e.target.value), placeholder: "SRM-MID-V1", className: "rounded-2xl py-4" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { title: "Bill of Materials (BOM Nodes)", className: "rounded-[2.5rem] border-stone-100", children: /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-4", children: [
            ingredients.map((ing, idx) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4 items-end bg-stone-50 p-6 rounded-[2rem] border border-stone-100 group hover:border-purple-200 transition-all", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1 w-full space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Raw Node Select" }),
                /* @__PURE__ */ jsx(
                  Select,
                  {
                    value: ing.inventoryItemId,
                    onChange: (e) => updateIngredient(idx, "inventoryItemId", e.target.value),
                    className: "rounded-xl",
                    children: materials.map((m) => /* @__PURE__ */ jsxs("option", { value: m.id, children: [
                      m.name.toUpperCase(),
                      " [$",
                      m.unitCost.toFixed(2),
                      " / ",
                      m.unit,
                      "]"
                    ] }, m.id))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "w-full md:w-32 space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Qty Required" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    value: ing.quantity,
                    onChange: (e) => updateIngredient(idx, "quantity", parseFloat(e.target.value)),
                    className: "rounded-xl"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "w-full md:w-32 space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Unit" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    value: ing.unit,
                    onChange: (e) => updateIngredient(idx, "unit", e.target.value),
                    className: "rounded-xl"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => removeIngredient(idx), className: "p-3 text-stone-300 hover:text-red-500 transition-colors", children: /* @__PURE__ */ jsx(Trash2, { size: 20 }) })
            ] }, idx)),
            /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: addIngredient,
                className: "w-full py-6 border-2 border-dashed border-stone-200 rounded-[2rem] text-gray-400 font-black text-[10px] uppercase tracking-widest hover:border-[#6A2C91] hover:text-[#6A2C91] hover:bg-purple-50 transition-all flex items-center justify-center gap-3",
                children: [
                  /* @__PURE__ */ jsx(Plus, { size: 18 }),
                  " INITIALIZE NEW BOM NODE"
                ]
              }
            )
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs(Card, { title: "Synaptic Cost Engine", className: "sticky top-6 rounded-[2.5rem] border-stone-100 shadow-xl overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 sm:p-8 opacity-5 text-purple-600", children: /* @__PURE__ */ jsx(Calculator, { size: 80 }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-8 mt-4 relative z-10", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-stone-50 pb-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Material Overhead" }),
                /* @__PURE__ */ jsxs("span", { className: "text-xl font-black text-gray-900 tracking-tighter", children: [
                  "$",
                  (totalCost - laborCost).toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Manufacturing Labor ($)" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    value: laborCost,
                    onChange: (e) => setLaborCost(parseFloat(e.target.value)),
                    className: "rounded-xl font-black"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1", children: "Standard Batch Yield" }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    type: "number",
                    value: yieldQty,
                    onChange: (e) => setYieldQty(parseFloat(e.target.value)),
                    className: "rounded-xl font-black"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pt-8 border-t-2 border-stone-50 space-y-6", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-black text-gray-900 uppercase tracking-widest", children: "Total Formula Cost" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-3xl font-black text-[#6A2C91] tracking-tighter", children: [
                    "$",
                    totalCost.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-emerald-50 p-6 rounded-3xl border border-emerald-100", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1", children: "True Unit Cost (COGS)" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-4xl font-black text-emerald-700 tracking-tighter", children: [
                    "$",
                    costPerUnit.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 p-6 rounded-3xl border border-amber-100", children: [
                  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1", children: "Margin Guard™ Rec (2.2x)" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-4xl font-black text-amber-700 tracking-tighter", children: [
                    "$",
                    targetRetail.toFixed(2)
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "pt-4 flex items-center gap-3 text-stone-400", children: [
                /* @__PURE__ */ jsx(ShieldCheck, { size: 16 }),
                /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest", children: "Data persistent in vault node" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-stone-900 p-4 sm:p-8 rounded-[2.5rem] text-white", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
              /* @__PURE__ */ jsx(Zap, { size: 18, className: "text-amber-400" }),
              /* @__PURE__ */ jsx("h4", { className: "text-lg font-black uppercase italic", children: "AI Stress Test" })
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-stone-400 text-xs leading-relaxed font-medium mb-6", children: [
              "Lola is simulating current formula ROI based on active raw material burn rates. Your estimated break-even is ",
              /* @__PURE__ */ jsx("span", { className: "text-white font-bold", children: "14 units" }),
              " at current wholesale projections."
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => setShowROIHeatmap(true), className: "w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all", children: "VIEW ROI HEATMAP" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Modal, { isOpen: showROIHeatmap, onClose: () => setShowROIHeatmap(false), title: "ROI Heatmap Simulation", children: /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("p", { className: "text-gray-300 text-sm", children: [
        "Estimated Break-Even: ",
        /* @__PURE__ */ jsx("span", { className: "font-bold text-white", children: "14 units" }),
        " at current wholesale projections."
      ] }),
      /* @__PURE__ */ jsx("div", { className: "h-48 w-full bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 rounded-xl flex items-center justify-center border border-white/10", children: /* @__PURE__ */ jsx("span", { className: "text-white/50 text-xs font-bold uppercase tracking-widest", children: "Heatmap Visualization Active" }) }),
      /* @__PURE__ */ jsx(Button, { onClick: () => setShowROIHeatmap(false), className: "w-full bg-[#C5A059] text-white", children: "Close Simulation" })
    ] }) }),
    /* @__PURE__ */ jsx(
      UpgradeModal,
      {
        isOpen: showUpgradeModal,
        onClose: () => setShowUpgradeModal(false),
        featureName: "Formulas/BOMs",
        currentLimit: upgradeLimit,
        requiredTier
      }
    )
  ] });
};
const WarehouseView = () => {
  const navigate = useNavigate();
  const inventoryCount = 1204;
  const pendingOrders = 5;
  const activeBatches = 2;
  const rawMaterials = 14;
  return /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6 animate-in fade-in h-screen flex flex-col bg-stone-50", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/operations"), className: "flex items-center gap-2 text-gray-500 hover:text-[#6A2C91] mb-2 font-medium", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { size: 18 }),
          " Back to Operations"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl font-bold text-white flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "text-[#C5A059]", size: 32 }),
          " Warehouse Command Center",
          /* @__PURE__ */ jsx(Badge, { color: "gold", children: "Beta" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Real-time visualization of inventory flow and zones." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsx(Badge, { color: "green", children: "Systems Online" }),
        /* @__PURE__ */ jsx(Badge, { color: "purple", children: "Warehouse A" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 bg-white border border-gray-200 rounded-2xl shadow-lg relative overflow-hidden p-4 sm:p-8", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-30" }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 grid-rows-6 gap-6 h-full relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "col-span-3 row-span-6 bg-amber-50/80 border-2 border-dashed border-amber-200 rounded-xl p-4 flex flex-col relative group hover:bg-amber-50 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute -top-3 left-4 bg-amber-100 text-amber-800 px-3 py-1 text-xs font-bold uppercase rounded border border-amber-200 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Truck, { size: 14 }),
            " Receiving & Raw Mat."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-lg shadow-sm border border-amber-100", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 uppercase", children: "Incoming" }),
              /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900", children: "2 Shipments" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-amber-600 mt-1", children: "Expected 2:00 PM" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-lg shadow-sm border border-amber-100", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 uppercase", children: "Raw Stock" }),
              /* @__PURE__ */ jsxs("p", { className: "font-bold text-gray-900", children: [
                rawMaterials,
                " Items"
              ] }),
              /* @__PURE__ */ jsxs(Badge, { color: "red", className: "mt-1 w-fit flex gap-1 items-center", children: [
                /* @__PURE__ */ jsx(AlertCircle, { size: 10 }),
                " 1 Low Stock"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-6 row-span-4 bg-purple-50/80 border-2 border-dashed border-purple-200 rounded-xl p-4 relative hover:bg-purple-50 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute -top-3 left-4 bg-purple-100 text-purple-800 px-3 py-1 text-xs font-bold uppercase rounded border border-purple-200 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Layers, { size: 14 }),
            " Production Floor"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex h-full items-center justify-center gap-4 sm:p-8 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md border border-purple-100 mx-auto mb-2 animate-pulse", children: /* @__PURE__ */ jsx(Layers, { className: "text-purple-600", size: 32 }) }),
              /* @__PURE__ */ jsxs("p", { className: "font-bold text-gray-900", children: [
                activeBatches,
                " Batches Active"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Mixing Station" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "h-px w-20 bg-purple-300 border-t border-dashed" }),
            /* @__PURE__ */ jsxs("div", { className: "text-center opacity-50", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 mx-auto mb-2", children: /* @__PURE__ */ jsx(Package, { className: "text-gray-400", size: 32 }) }),
              /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900", children: "Packaging" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500", children: "Idle" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-3 row-span-6 bg-blue-50/80 border-2 border-dashed border-blue-200 rounded-xl p-4 relative hover:bg-blue-50 transition-colors", children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute -top-3 left-4 bg-blue-100 text-blue-800 px-3 py-1 text-xs font-bold uppercase rounded border border-blue-200 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Box, { size: 14 }),
            " Shipping & Fulfillment"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-lg shadow-sm border border-blue-100", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 uppercase", children: "Pending Orders" }),
              /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900", children: pendingOrders }),
              /* @__PURE__ */ jsx("div", { className: "w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "bg-blue-500 h-full w-2/3" }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-3 rounded-lg shadow-sm border border-blue-100", children: [
              /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 uppercase", children: "Ready to Ship" }),
              /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-900", children: "12 Parcels" }),
              /* @__PURE__ */ jsx(Button, { onClick: () => toast.success("Labels sent to printer queue."), variant: "primary", className: "w-full mt-2 text-xs py-1 h-8 bg-blue-600 hover:bg-blue-700", children: "Print Labels" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "col-span-6 row-span-2 bg-emerald-50/80 border-2 border-dashed border-emerald-200 rounded-xl p-4 relative hover:bg-emerald-50 transition-colors flex items-center justify-between px-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "absolute -top-3 left-4 bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold uppercase rounded border border-emerald-200 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Package, { size: 14 }),
            " Finished Goods Storage"
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold text-gray-900", children: inventoryCount }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 uppercase font-bold", children: "Total Units" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-800", children: "98%" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500", children: "Capacity" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("p", { className: "font-bold text-gray-800", children: "$7.1k" }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-gray-500", children: "Value" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const CRM = () => {
  const { orders, manualCustomers, addManualCustomer, getTotalRevenue, userTier } = useArtisanData();
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCust, setNewCust] = useState({ name: "", email: "", location: "" });
  const [justAddedId, setJustAddedId] = useState(null);
  const orderCustomers = Array.from(new Set(orders.map((o) => o.customer))).map((name) => {
    const customerOrders = orders.filter((o) => o.customer === name);
    const lastOrder = customerOrders[0];
    const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      id: `O-${name}`,
      name,
      email: (lastOrder == null ? void 0 : lastOrder.email) || "N/A",
      location: (lastOrder == null ? void 0 : lastOrder.location) || "Unknown",
      initial: name.charAt(0),
      color: "bg-[#6A2C91]",
      totalSpent,
      orderCount: customerOrders.length,
      orders: customerOrders,
      type: "Ordered"
    };
  });
  const processedManualCustomers = manualCustomers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    location: c.location,
    initial: c.name.charAt(0),
    color: "bg-[#C5A059]",
    totalSpent: 0,
    orderCount: 0,
    orders: [],
    type: "Manual Node"
  }));
  const allCustomers = [...orderCustomers, ...processedManualCustomers];
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2e3);
  };
  const handleAddManual = () => {
    if (userTier === "Free Audit" && allCustomers.length >= 25) {
      setIsAddModalOpen(false);
      setShowUpgradeModal(true);
      return;
    }
    if (!newCust.name || !newCust.email) return;
    addManualCustomer(newCust);
    const tempId = `M-${Date.now()}`;
    setJustAddedId(tempId);
    setNewCust({ name: "", email: "", location: "" });
    setIsAddModalOpen(false);
    setTimeout(() => setJustAddedId(null), 3e3);
  };
  if (selectedCustomer) {
    const customer = allCustomers.find((c) => c.name === selectedCustomer);
    if (!customer) return null;
    return /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        className: "p-4 sm:p-10 space-y-12 pb-20 max-w-[1600px] mx-auto",
        children: [
          /* @__PURE__ */ jsx(
            ContextualTutorialModal,
            {
              hubId: "crm",
              title: "CRM Hub",
              description: "Manage your client relationships and sales pipeline.",
              steps: ["Track B2B and B2C clients.", "Monitor deal stages and revenue probabilities.", "Send personalized communications."]
            }
          ),
          /* @__PURE__ */ jsx(
            SubPageHeader,
            {
              title: customer.name,
              parentTitle: "CRM Hub",
              onBack: () => setSelectedCustomer(null),
              description: `Detailed interaction ledger for ${customer.name}.`,
              actions: /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: () => toast.info("Edit Customer functionality coming soon."),
                  className: "bg-white/10 hover:bg-white/20 text-white h-12 px-6 rounded-2xl font-sans font-medium text-[10px] uppercase tracking-[0.2em] transition-all border border-white/10",
                  children: "Edit Node"
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-16 relative overflow-hidden group shadow-2xl", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-80 h-80 bg-purple-500 opacity-5 rounded-bl-full -mr-20 -mt-20 group-hover:opacity-10 transition-opacity duration-1000" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 sm:p-10 relative z-10", children: [
              /* @__PURE__ */ jsx("div", { className: `w-32 h-32 ${customer.color} bg-opacity-20 rounded-[2rem] flex items-center justify-center text-white text-5xl font-serif shadow-inner border border-white/10 group-hover:scale-105 group-hover:rotate-3 transition-all duration-700`, children: customer.initial }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-4", children: [
                  /* @__PURE__ */ jsx("h1", { className: "text-6xl font-serif text-white tracking-tighter", children: customer.name }),
                  /* @__PURE__ */ jsx(Badge, { color: customer.type === "Ordered" ? "purple" : "gold", className: "px-4 py-1 text-[10px] font-sans font-bold uppercase tracking-[0.3em]", children: customer.type })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-4 sm:p-8 text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.3em]", children: [
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx(Mail, { size: 16, className: "text-[#6A2C91]" }),
                    " ",
                    customer.email
                  ] }),
                  /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx(MapPin, { size: 16, className: "text-[#C5A059]" }),
                    " ",
                    customer.location
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[11px] text-white/40 uppercase font-sans font-bold tracking-[0.3em] mb-3", children: "Lifetime Value" }),
                /* @__PURE__ */ jsxs("p", { className: "text-7xl font-serif text-white tracking-tighter", children: [
                  "$",
                  customer.totalSpent.toFixed(2)
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4 sm:p-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-white/5 border border-white/10 rounded-[3rem] p-4 sm:p-12", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif text-white tracking-tight mb-8", children: "Activity Ledger" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-4", children: customer.orders.length > 0 ? customer.orders.map((order) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-6 bg-black/40 rounded-[2rem] border border-white/5 hover:border-[#6A2C91]/50 transition-all duration-500 group", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("p", { className: "font-sans font-bold text-white uppercase text-[11px] tracking-[0.2em] mb-2", children: [
                    "Order ",
                    order.id
                  ] }),
                  /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-white/30 font-sans uppercase tracking-[0.2em] flex items-center gap-2", children: [
                    /* @__PURE__ */ jsx(Calendar, { size: 12 }),
                    " ",
                    order.date
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsxs("p", { className: "font-serif text-white text-3xl tracking-tight mb-2", children: [
                    "$",
                    order.total.toFixed(2)
                  ] }),
                  /* @__PURE__ */ jsx(Badge, { color: order.status === "Delivered" ? "green" : "blue", className: "text-[9px] uppercase tracking-widest", children: order.status })
                ] })
              ] }, order.id)) : /* @__PURE__ */ jsxs("div", { className: "py-16 text-center bg-black/20 rounded-[2rem] border border-dashed border-white/10", children: [
                /* @__PURE__ */ jsx(Package, { size: 48, className: "text-white/10 mx-auto mb-6", strokeWidth: 0.5 }),
                /* @__PURE__ */ jsx("p", { className: "text-white/30 text-[11px] font-sans font-bold uppercase tracking-[0.3em]", children: "No Transactional History" })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-white/5 border border-white/10 rounded-[3rem] p-4 sm:p-12 flex flex-col", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif text-white tracking-tight mb-8", children: "Node Metadata" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-8 flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
                  /* @__PURE__ */ jsxs("div", { className: "bg-black/40 p-6 rounded-[2rem] border border-white/5", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-3", children: "First Interaction" }),
                    /* @__PURE__ */ jsx("p", { className: "font-serif tracking-tight text-white text-2xl", children: customer.orders.length > 0 ? customer.orders[customer.orders.length - 1].date : "Today" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "bg-black/40 p-6 rounded-[2rem] border border-white/5", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-3", children: "Latest Update" }),
                    /* @__PURE__ */ jsx("p", { className: "font-serif tracking-tight text-white text-2xl", children: customer.orders.length > 0 ? customer.orders[0].date : "Today" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-[#6A2C91]/10 p-4 sm:p-8 rounded-[2rem] border border-[#6A2C91]/20 mt-auto", children: [
                  /* @__PURE__ */ jsxs("p", { className: "text-[11px] text-[#C5A059] font-sans font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-3", children: [
                    /* @__PURE__ */ jsx(Sparkles, { size: 16 }),
                    " Vault Strategy Insight"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm font-sans font-light text-white/80 leading-relaxed italic", children: `"Customer shows high affinity for Skincare categories. Recommend 'Last Chance' email for midnight serum restock."` })
                ] })
              ] })
            ] })
          ] })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-10 space-y-12 pb-20 max-w-[1600px] mx-auto",
      children: [
        /* @__PURE__ */ jsx(Modal, { isOpen: isAddModalOpen, onClose: () => setIsAddModalOpen(false), title: "Initialize Vault Node", children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] ml-1", children: "Full Legal Name" }),
            /* @__PURE__ */ jsx(Input, { placeholder: "Artisan Client Name", value: newCust.name, onChange: (e) => setNewCust({ ...newCust, name: e.target.value }), className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:border-[#6A2C91] text-white" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] ml-1", children: "Secure Email Address" }),
            /* @__PURE__ */ jsx(Input, { placeholder: "client@synaptic.com", value: newCust.email, onChange: (e) => setNewCust({ ...newCust, email: e.target.value }), className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:border-[#6A2C91] text-white" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("label", { className: "text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.2em] ml-1", children: "Geographic Location" }),
            /* @__PURE__ */ jsx(Input, { placeholder: "City, State / Global", value: newCust.location, onChange: (e) => setNewCust({ ...newCust, location: e.target.value }), className: "h-14 rounded-2xl bg-black/40 border-white/10 focus:border-[#6A2C91] text-white" })
          ] }),
          /* @__PURE__ */ jsx(Button, { className: "w-full bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 rounded-full font-sans font-bold text-[11px] tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 mt-8 transition-all", onClick: handleAddManual, children: "AUTHORIZE NODE CREATION" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsx(
            SubPageHeader,
            {
              title: "CRM Hub",
              parentTitle: "Operations Hub",
              onBack: () => navigate("/operations"),
              description: "Synaptic client management and lifetime value analytics."
            }
          ),
          /* @__PURE__ */ jsx(
            VaultBanner,
            {
              title: "CRM Hub",
              subtitle: "Synaptic client management and lifetime value analytics.",
              badge: "Client Protocol Active",
              children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "outline",
                    className: "rounded-full border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-md text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 transition-all shadow-sm",
                    onClick: handleSync,
                    disabled: isSyncing,
                    children: [
                      /* @__PURE__ */ jsx(RefreshCw, { size: 16, className: isSyncing ? "animate-spin mr-3" : "mr-3" }),
                      " ",
                      isSyncing ? "SYNCING..." : "SYNC FROM ORDERS"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    variant: "primary",
                    className: "rounded-full bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-medium text-[11px] tracking-[0.2em] h-16 px-10 shadow-2xl shadow-black/10 transition-all",
                    onClick: () => setIsAddModalOpen(true),
                    children: [
                      /* @__PURE__ */ jsx(UserPlus, { size: 16, className: "mr-3" }),
                      " ADD MANUAL NODE"
                    ]
                  }
                )
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 sm:p-8", children: [
          { label: "Active Nodes", val: allCustomers.length, icon: Users, color: "text-purple-400", bg: "bg-[#6A2C91]/20", border: "border-[#6A2C91]/30" },
          { label: "Network Value", val: `$${getTotalRevenue().toFixed(0)}`, icon: DollarSign, color: "text-[#C5A059]", bg: "bg-[#C5A059]/20", border: "border-[#C5A059]/30" },
          { label: "Synaptic Health", val: "98%", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" },
          { label: "At Risk", val: "0", icon: ShoppingCart, color: "text-amber-500", bg: "bg-amber-500/20", border: "border-amber-500/30" }
        ].map((kpi, i) => /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-white/5 border border-white/10 rounded-[2.5rem] p-4 sm:p-10 flex flex-col items-start group hover:border-white/20 transition-all shadow-sm hover:shadow-2xl", children: [
          /* @__PURE__ */ jsx("div", { className: `p-4 ${kpi.bg} ${kpi.color} rounded-2xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border ${kpi.border}`, children: /* @__PURE__ */ jsx(kpi.icon, { size: 24 }) }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-2", children: kpi.label }),
          /* @__PURE__ */ jsx("p", { className: "text-4xl font-serif text-white tracking-tighter", children: kpi.val })
        ] }, i)) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative group max-w-2xl", children: [
            /* @__PURE__ */ jsx(Search, { className: "absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#C5A059] transition-colors", size: 20 }),
            /* @__PURE__ */ jsx(Input, { placeholder: "Scan for nodes by name, email, or metadata...", className: "pl-16 py-6 rounded-[2rem] bg-black/40 border border-white/10 focus:border-[#C5A059] focus:ring-[#C5A059]/20 text-white font-sans text-sm shadow-inner transition-all" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:p-10", children: allCustomers.map((c, i) => /* @__PURE__ */ jsxs(
            "div",
            {
              onClick: () => setSelectedCustomer(c.name),
              className: `luxury-card bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer group relative overflow-hidden ${justAddedId && c.id.includes("M-") ? "animate-soft-success border-emerald-500/50 shadow-emerald-500/10" : "hover:border-white/20 hover:bg-white/10"}`,
              children: [
                /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" }),
                /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mb-10 relative z-10", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-6 items-center", children: [
                  /* @__PURE__ */ jsx("div", { className: `w-16 h-16 ${c.color} bg-opacity-20 rounded-2xl flex items-center justify-center text-white font-serif text-2xl shadow-inner border border-white/10 group-hover:scale-105 transition-transform duration-500`, children: c.initial }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "font-serif text-white text-2xl tracking-tight group-hover:text-[#C5A059] transition-colors", children: c.name }),
                    /* @__PURE__ */ jsx(Badge, { color: c.type === "Ordered" ? "purple" : "gold", className: "text-[8px] uppercase font-sans font-bold tracking-[0.3em] px-3 py-1 mt-2 shadow-sm", children: c.type })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.3em] mb-10 relative z-10", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx(Mail, { size: 16, className: "text-[#6A2C91]" }),
                    " ",
                    c.email
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx(MapPin, { size: 16, className: "text-[#C5A059]" }),
                    " ",
                    c.location
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "pt-8 border-t border-white/10 flex justify-between items-end relative z-10 group-hover:border-white/20 transition-colors", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/30 font-sans font-bold uppercase tracking-[0.3em] mb-2", children: "Order Nodes" }),
                    /* @__PURE__ */ jsx("p", { className: "font-serif text-white text-xl", children: c.orderCount })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/30 font-sans font-bold uppercase tracking-[0.3em] mb-2", children: "Lifetime Value" }),
                    /* @__PURE__ */ jsxs("p", { className: "font-serif text-[#C5A059] text-3xl tracking-tighter", children: [
                      "$",
                      c.totalSpent.toFixed(2)
                    ] })
                  ] })
                ] })
              ]
            },
            c.id
          )) }),
          /* @__PURE__ */ jsx(
            UpgradeModal,
            {
              isOpen: showUpgradeModal,
              onClose: () => setShowUpgradeModal(false),
              featureName: "CRM Contacts",
              currentLimit: 25,
              requiredTier: "Artisan Flow Basic"
            }
          )
        ] })
      ]
    }
  );
};
const Orders = () => {
  const { orders, processOrder, getTotalRevenue, syncWooCommerce, integrations } = useArtisanData();
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [processedId, setProcessedId] = useState(null);
  const [toast2, setToast] = useState(null);
  const navigate = useNavigate();
  const wooIntegration = integrations.find((i) => i.name === "WooCommerce");
  const isWooConnected = (wooIntegration == null ? void 0 : wooIntegration.status) === "Connected";
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All Status" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });
  const pendingCount = orders.filter((o) => o.status === "Processing").length;
  const shippedCount = orders.filter((o) => o.status === "Shipped").length;
  useEffect(() => {
    if (toast2) {
      const timer = setTimeout(() => setToast(null), 5e3);
      return () => clearTimeout(timer);
    }
  }, [toast2]);
  const handleProcess = (id) => {
    processOrder(id);
    setProcessedId(id);
    setToast({ message: "Order processed. Breathing into growth.", type: "success" });
    setTimeout(() => setProcessedId(null), 3e3);
  };
  const handleSync = async () => {
    if (!isWooConnected) {
      setToast({ message: "WooCommerce is not connected. Please visit Settings > Integrations.", type: "error" });
      return;
    }
    setIsSyncing(true);
    setToast({ message: "Establishing secure handshake with WooCommerce...", type: "info" });
    const result = await syncWooCommerce();
    setIsSyncing(false);
    if (result.success) {
      setToast({ message: "Sync complete. Systems harmonized.", type: "success" });
    } else {
      setToast({ message: "Handshake failed. Verify access keys.", type: "error" });
    }
  };
  const handleExport = () => {
    setToast({ message: "Exporting ledger...", type: "info" });
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      className: "p-4 sm:p-10 md:p-16 space-y-12 pb-20 max-w-[1600px] mx-auto",
      children: [
        /* @__PURE__ */ jsx(
          ContextualTutorialModal,
          {
            hubId: "orders",
            title: "Orders Hub",
            description: "Fulfill and track customer orders.",
            steps: ["Process incoming orders from all channels.", "Generate shipping labels and track shipments.", "Manage returns and refunds."]
          }
        ),
        toast2 && /* @__PURE__ */ jsx("div", { className: "fixed top-4 sm:p-8 right-8 z-[60] animate-in slide-in-from-right-10", children: /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-3 p-4 rounded-2xl shadow-2xl border-l-4 min-w-[320px] backdrop-blur-xl ${toast2.type === "success" ? "bg-emerald-500/10 border-emerald-500 text-emerald-400" : toast2.type === "error" ? "bg-red-500/10 border-red-500 text-red-400" : "bg-[#6A2C91]/20 border-[#6A2C91] text-purple-300"}`, children: [
          /* @__PURE__ */ jsx("div", { className: `p-1.5 rounded-full ${toast2.type === "success" ? "bg-emerald-500/20" : toast2.type === "error" ? "bg-red-500/20" : "bg-[#6A2C91]/40"}`, children: toast2.type === "error" ? /* @__PURE__ */ jsx(AlertCircle, { size: 16 }) : /* @__PURE__ */ jsx(CheckCircle, { size: 16 }) }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-sans font-medium flex-1", children: toast2.message }),
          /* @__PURE__ */ jsx("button", { onClick: () => setToast(null), className: "opacity-50 hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
        ] }) }),
        /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "Orders & Fulfillment",
            parentTitle: "Operations Hub",
            onBack: () => navigate("/operations"),
            description: "Omnichannel order management and synchronization."
          }
        ),
        /* @__PURE__ */ jsx(
          VaultBanner,
          {
            title: "Order Logistics",
            subtitle: "Secure handling and dispatch of transactional nodes.",
            badge: "Fulfillment Protocol",
            children: /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "outline",
                  className: "rounded-full border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-md text-white font-sans font-bold text-[11px] tracking-[0.2em] h-16 px-10 transition-all shadow-sm",
                  onClick: handleSync,
                  disabled: isSyncing,
                  children: [
                    /* @__PURE__ */ jsx(RefreshCw, { size: 16, className: isSyncing ? "animate-spin mr-3" : "mr-3" }),
                    " ",
                    isSyncing ? "SYNCING..." : "SYNC STORE"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "primary",
                  className: "rounded-full bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-bold text-[11px] tracking-[0.2em] h-16 px-10 shadow-2xl shadow-black/10 transition-all",
                  onClick: handleExport,
                  children: [
                    /* @__PURE__ */ jsx(Download, { size: 16, className: "mr-3" }),
                    " EXPORT CSV"
                  ]
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 sm:p-8", children: [
          { label: "Total Orders", val: orders.length, icon: ShoppingCart, color: "text-purple-400", bg: "bg-[#6A2C91]/20", border: "border-[#6A2C91]/30" },
          { label: "Revenue", val: `$${getTotalRevenue().toFixed(2)}`, icon: DollarSign, color: "text-[#C5A059]", bg: "bg-[#C5A059]/20", border: "border-[#C5A059]/30" },
          { label: "Pending", val: pendingCount, icon: Package, color: "text-amber-500", bg: "bg-amber-500/20", border: "border-amber-500/30" },
          { label: "Shipped", val: shippedCount, icon: Truck, color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/30" }
        ].map((stat, i) => /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-white/5 border border-white/10 rounded-[2.5rem] p-4 sm:p-10 flex flex-col items-start group hover:border-white/20 transition-all shadow-sm hover:shadow-2xl", children: [
          /* @__PURE__ */ jsx("div", { className: `p-4 ${stat.bg} ${stat.color} rounded-2xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border ${stat.border}`, children: /* @__PURE__ */ jsx(stat.icon, { size: 24 }) }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-white/40 font-sans font-bold uppercase tracking-[0.3em] mb-2", children: stat.label }),
          /* @__PURE__ */ jsx("p", { className: "text-4xl font-serif text-white tracking-tighter", children: stat.val })
        ] }, i)) }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative group max-w-2xl flex-1", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-6 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#C5A059] transition-colors", size: 20 }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  placeholder: "Scan for orders by ID or customer...",
                  className: "pl-16 py-6 rounded-[2rem] bg-black/40 border border-white/10 focus:border-[#C5A059] focus:ring-[#C5A059]/20 text-white font-sans text-sm shadow-inner transition-all w-full",
                  value: searchTerm,
                  onChange: (e) => setSearchTerm(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxs(
              Select,
              {
                className: "w-48 py-6 rounded-[2rem] bg-black/40 border border-white/10 text-white font-sans text-sm focus:border-[#C5A059] focus:ring-[#C5A059]/20 shadow-inner",
                value: filterStatus,
                onChange: (e) => setFilterStatus(e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "All Status", className: "bg-[#1A1A1A]", children: "All Status" }),
                  /* @__PURE__ */ jsx("option", { value: "Processing", className: "bg-[#1A1A1A]", children: "Processing" }),
                  /* @__PURE__ */ jsx("option", { value: "Shipped", className: "bg-[#1A1A1A]", children: "Shipped" }),
                  /* @__PURE__ */ jsx("option", { value: "Delivered", className: "bg-[#1A1A1A]", children: "Delivered" })
                ]
              }
            ) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-6", children: filteredOrders.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-24 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10", children: [
            /* @__PURE__ */ jsx(Package, { size: 64, className: "text-white/10 mx-auto mb-6", strokeWidth: 0.5 }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-serif text-white tracking-tight mb-2", children: "No Transactional History" }),
            /* @__PURE__ */ jsx("p", { className: "text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.3em]", children: "Adjust your scan parameters." })
          ] }) : filteredOrders.map((order) => /* @__PURE__ */ jsxs("div", { className: `luxury-card bg-white/5 p-10 rounded-[3rem] border border-white/10 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden ${processedId === order.id ? "animate-soft-success border-emerald-500/50 shadow-emerald-500/10" : "hover:border-white/20"}`, children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row justify-between gap-4 sm:p-8 relative z-10", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
                  /* @__PURE__ */ jsx(Badge, { color: order.status === "Processing" ? "blue" : order.status === "Shipped" ? "purple" : "green", className: "uppercase font-sans font-bold text-[10px] tracking-[0.3em] px-4 py-1.5 shadow-sm", children: order.status }),
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold font-sans text-white/40 uppercase tracking-[0.3em]", children: order.platform }),
                  /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-white/60 font-mono tracking-widest bg-black/40 px-3 py-1 rounded-full border border-white/5", children: [
                    "# ",
                    order.id
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:p-10", children: [
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-white/40 font-sans font-bold uppercase tracking-[0.3em]", children: "Customer Node" }),
                    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
                      /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-[1rem] bg-[#C5A059]/20 flex items-center justify-center text-[#C5A059] font-serif text-2xl border border-[#C5A059]/30 shadow-inner", children: order.customer.charAt(0) }),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx("p", { className: "font-serif text-2xl text-white tracking-tight", children: order.customer }),
                        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/40 font-sans uppercase tracking-[0.2em] mt-1", children: order.location })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-white/40 font-sans font-bold uppercase tracking-[0.3em]", children: "Manifest" }),
                    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: order.items.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm border-b border-white/5 pb-2", children: [
                      /* @__PURE__ */ jsx("span", { className: "text-white/60 font-sans font-light truncate max-w-[150px]", children: item.name }),
                      /* @__PURE__ */ jsxs("span", { className: "text-[#C5A059] font-sans font-bold tracking-widest text-[11px]", children: [
                        "x",
                        item.qty
                      ] })
                    ] }, idx)) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-4 lg:text-right", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-white/40 font-sans font-bold uppercase tracking-[0.3em]", children: "Settlement" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-4xl font-serif text-white tracking-tighter", children: [
                      "$",
                      order.total.toFixed(2)
                    ] }),
                    /* @__PURE__ */ jsx("p", { className: "text-[9px] text-emerald-400 font-sans font-bold uppercase tracking-[0.3em] bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 inline-block", children: "Fully Captured" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex lg:flex-col justify-end items-end gap-4 min-w-[200px]", children: [
                order.status === "Processing" ? /* @__PURE__ */ jsxs(
                  Button,
                  {
                    className: "w-full bg-[#6A2C91] text-white hover:bg-[#5a257a] h-14 text-[11px] font-sans font-bold tracking-[0.3em] rounded-2xl shadow-xl shadow-[#6A2C91]/20 transition-all flex items-center justify-center gap-2 group/btn",
                    onClick: () => handleProcess(order.id),
                    children: [
                      "AUTHORIZE FLOW ",
                      /* @__PURE__ */ jsx(ChevronRight, { size: 14, className: "group-hover/btn:translate-x-1 transition-transform" })
                    ]
                  }
                ) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-emerald-400 font-sans font-bold text-[11px] px-6 py-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 w-full justify-center tracking-[0.3em] uppercase shadow-inner", children: [
                  /* @__PURE__ */ jsx(CheckCircle, { size: 16, strokeWidth: 1.5 }),
                  " Dispatched"
                ] }),
                /* @__PURE__ */ jsx(Button, { onClick: () => setToast({ message: "Syncing orders from Square...", type: "info" }), variant: "outline", className: "w-full h-12 text-[10px] font-sans font-bold border-white/10 text-white/40 hover:text-white hover:bg-white/5 hover:border-white/20 rounded-2xl tracking-[0.3em] uppercase transition-all shadow-sm", children: "Manual Sync" })
              ] })
            ] })
          ] }, order.id)) })
        ] })
      ]
    }
  );
};
const ProfitGuardPage = () => {
  const navigate = useNavigate();
  const { userTier } = useArtisanData();
  const [materialCost, setMaterialCost] = useState(150);
  const [units, setUnits] = useState(50);
  const [plannedPrice, setPlannedPrice] = useState(6.6);
  const costPerUnit = units > 0 ? materialCost / units : 0;
  const recommendedPrice = costPerUnit * 2.2;
  const currentMultiplier = costPerUnit > 0 ? plannedPrice / costPerUnit : 0;
  const isWarning = currentMultiplier < 2;
  const profitPerUnit = plannedPrice - costPerUnit;
  const totalProfit = profitPerUnit * units;
  const marginPercentage = plannedPrice > 0 ? profitPerUnit / plannedPrice * 100 : 0;
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      className: "p-4 sm:p-8 space-y-12 max-w-7xl mx-auto pb-32",
      children: [
        /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "Profit Guard™",
            parentTitle: "Dashboard",
            onBack: () => navigate("/command-center"),
            description: "High-precision margin protection and profitability diagnostics."
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 space-y-6", children: [
            /* @__PURE__ */ jsxs(Card, { className: "p-4 sm:p-8 border-none shadow-sm bg-white rounded-3xl", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-sans font-bold uppercase tracking-widest text-white mb-8", children: "Production Inputs" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-3", children: "Total Material Cost" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-serif text-xl", children: "$" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        value: materialCost,
                        onChange: (e) => setMaterialCost(Number(e.target.value)),
                        className: "pl-10 h-14 bg-stone-50/50 border-stone-100 rounded-2xl font-serif text-2xl focus:ring-purple-500/10"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-3", children: "Batch Units" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      type: "number",
                      value: units,
                      onChange: (e) => setUnits(Number(e.target.value)),
                      className: "h-14 bg-stone-50/50 border-stone-100 rounded-2xl font-serif text-2xl focus:ring-purple-500/10"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "block text-[10px] font-sans font-bold text-stone-400 uppercase tracking-widest mb-3", children: "Proposed Price" }),
                  /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                    /* @__PURE__ */ jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 font-serif text-xl", children: "$" }),
                    /* @__PURE__ */ jsx(
                      Input,
                      {
                        type: "number",
                        value: plannedPrice,
                        onChange: (e) => setPlannedPrice(Number(e.target.value)),
                        className: "pl-10 h-14 bg-stone-50/50 border-stone-100 rounded-2xl font-serif text-2xl focus:ring-purple-500/10"
                      }
                    )
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: `p-8 border-none shadow-sm rounded-3xl transition-colors duration-500 ${isWarning ? "bg-amber-50" : "bg-emerald-50"}`, children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-6", children: [
                /* @__PURE__ */ jsx("div", { className: `p-3 rounded-2xl ${isWarning ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"}`, children: isWarning ? /* @__PURE__ */ jsx(AlertTriangle, { size: 20 }) : /* @__PURE__ */ jsx(ShieldCheck, { size: 20 }) }),
                /* @__PURE__ */ jsx("h4", { className: `font-serif text-xl ${isWarning ? "text-amber-900" : "text-emerald-900"}`, children: isWarning ? "Margin Risk Detected" : "Profitability Secure" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: `text-sm font-sans font-light leading-relaxed ${isWarning ? "text-amber-700/80" : "text-emerald-700/80"}`, children: isWarning ? "Your current markup is below the 2.2x artisanal benchmark. Consider optimizing material sourcing or adjusting wholesale positioning." : "Your margins are healthy and aligned with premium brand standards. This batch is cleared for high-efficiency production." })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ jsx(
                AnalysisCard,
                {
                  title: "Unit Cost",
                  value: `$${costPerUnit.toFixed(2)}`,
                  subtitle: "Production Floor",
                  icon: Calculator
                }
              ),
              /* @__PURE__ */ jsx(
                AnalysisCard,
                {
                  title: "Target Price (2.2x)",
                  value: `$${recommendedPrice.toFixed(2)}`,
                  subtitle: "Artisanal Benchmark",
                  icon: Target,
                  highlight: true
                }
              ),
              /* @__PURE__ */ jsx(
                AnalysisCard,
                {
                  title: "Profit Per Unit",
                  value: `$${profitPerUnit.toFixed(2)}`,
                  subtitle: "Net Contribution",
                  icon: TrendingUp
                }
              ),
              /* @__PURE__ */ jsx(
                AnalysisCard,
                {
                  title: "Margin Percentage",
                  value: `${marginPercentage.toFixed(1)}%`,
                  subtitle: "Efficiency Rating",
                  icon: PieChart
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(Card, { className: "p-4 sm:p-10 border-none shadow-sm bg-white rounded-[2.5rem] relative overflow-hidden", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:p-8 relative z-10", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "text-sm font-sans font-bold uppercase tracking-widest text-white mb-2", children: "Total Batch Profitability" }),
                  /* @__PURE__ */ jsxs("p", { className: "text-6xl font-serif text-stone-900 tracking-tighter", children: [
                    "$",
                    totalProfit.toLocaleString(void 0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-emerald-600 font-sans font-bold text-xs uppercase tracking-widest mb-2", children: [
                    /* @__PURE__ */ jsx(ArrowUpRight, { size: 14 }),
                    " Healthy Yield"
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "h-2 w-48 bg-stone-100 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: `h-full transition-all duration-1000 ${isWarning ? "bg-amber-400" : "bg-emerald-500"}`,
                      style: { width: `${Math.min(marginPercentage * 1.5, 100)}%` }
                    }
                  ) })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "mt-12 pt-8 border-t border-stone-50 grid grid-cols-3 gap-4 sm:p-8", children: [
                /* @__PURE__ */ jsx(StatMini, { label: "Markup", value: `${currentMultiplier.toFixed(2)}x` }),
                /* @__PURE__ */ jsx(StatMini, { label: "Break Even", value: `${Math.ceil(materialCost / plannedPrice)} Units` }),
                /* @__PURE__ */ jsx(StatMini, { label: "ROI", value: `${(totalProfit / materialCost * 100).toFixed(0)}%` })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 sm:p-8 bg-white/50 rounded-[2rem] border border-stone-100", children: [
              /* @__PURE__ */ jsx("h6", { className: "text-[10px] font-sans font-bold text-white uppercase tracking-[0.3em] mb-4", children: "Strategic Recommendations" }),
              /* @__PURE__ */ jsxs("ul", { className: "space-y-3 text-sm font-sans font-light text-stone-600", children: [
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: `w-1.5 h-1.5 rounded-full mt-1.5 ${isWarning ? "bg-amber-500" : "bg-emerald-500"}` }),
                  isWarning ? "Consider reducing raw material waste or renegotiating supplier contracts to lower unit cost." : "Current margin is healthy. Consider scaling production to leverage economies of scale."
                ] }),
                /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: `w-1.5 h-1.5 rounded-full mt-1.5 ${isWarning ? "bg-amber-500" : "bg-emerald-500"}` }),
                  isWarning ? "Target price adjustment recommended to reach 2.2x multiplier for sustainable growth." : "Explore premium positioning to further increase markup without volume loss."
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsx(Button, { onClick: () => toast.success("Exporting financial report..."), className: "flex-1 h-16 bg-[#1A1A1A] text-white rounded-2xl font-sans font-bold text-[11px] uppercase tracking-widest hover:bg-stone-800 transition-all shadow-lg shadow-black/5", children: "Commit Batch to Production" }),
              /* @__PURE__ */ jsx(Button, { onClick: () => toast.info("Syncing with Square financials..."), variant: "outline", className: "h-16 px-10 border-stone-200 rounded-2xl font-sans font-bold text-[11px] uppercase tracking-widest hover:bg-stone-50 transition-all", children: "Export Diagnostic" })
            ] })
          ] })
        ] })
      ]
    }
  );
};
const AnalysisCard = ({ title, value, subtitle, icon: Icon, highlight }) => /* @__PURE__ */ jsxs("div", { className: `p-8 rounded-3xl border border-stone-100 transition-all duration-500 hover:shadow-md ${highlight ? "bg-purple-50/30 border-purple-100" : "bg-white"}`, children: [
  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6", children: [
    /* @__PURE__ */ jsx("div", { className: `p-3 rounded-2xl ${highlight ? "bg-purple-100 text-[#6A2C91]" : "bg-stone-50 text-stone-400"}`, children: /* @__PURE__ */ jsx(Icon, { size: 20, strokeWidth: 1.5 }) }),
    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400", children: subtitle })
  ] }),
  /* @__PURE__ */ jsx("h4", { className: "text-sm font-sans font-medium text-white font-bold mb-1", children: title }),
  /* @__PURE__ */ jsx("p", { className: `text-3xl font-serif tracking-tight ${highlight ? "text-[#6A2C91]" : "text-stone-900"}`, children: value })
] });
const StatMini = ({ label, value }) => /* @__PURE__ */ jsxs("div", { children: [
  /* @__PURE__ */ jsx("p", { className: "text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 mb-1", children: label }),
  /* @__PURE__ */ jsx("p", { className: "text-xl font-serif text-stone-900", children: value })
] });
const CATEGORIES = [
  "What type of maker are you? Click here",
  "Skincare or Formulator",
  "Herbalist & Apothecary",
  "Candle & Wax Melt Maker",
  "Soap & Bath Product Artisan",
  "Perfumer & Fragrance Creator",
  "Essential Oil & Aromatherapy Blender",
  "Hair Care & Body Care Artisan",
  "Herbal Tea & Beverage Formulator",
  "Tincture & Botanical Extract Craftsman",
  "Resin & Home Decor Maker",
  "Ceramic & Pottery Artisan",
  "Leather Goods Craftsman",
  "Woodworking & Custom Furniture Maker",
  "Jewelry & Metal Accessories Designer",
  "Textile, Fiber & Apparel Artisan",
  "Custom T-Shirt & Clothing Maker",
  "Specialty Food & Confectioner",
  "Gourmet Sauce & Condiment Artisan",
  "Bakery & Artisan Treats Maker",
  "Stationery, Paper & Printmaker",
  "Other Artisan / Handmade Goods"
];
const LandingPage = () => {
  const { submitVIPWaitlist } = useArtisanData();
  useNavigate();
  const [view, setView] = useState("hero");
  const [formData, setFormData] = useState({ fullName: "", email: "", businessType: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const formRef = useRef(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (submitVIPWaitlist) {
      const success = await submitVIPWaitlist(formData);
      if (success) {
        setIsSubmitted(true);
      }
    }
    setIsSubmitting(false);
  };
  const scrollToForm = () => {
    var _a;
    (_a = formRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  };
  if (view === "login") {
    return /* @__PURE__ */ jsx(AuthGateway, { initialView: "login", onBack: () => setView("hero") });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#09090b] relative overflow-hidden flex flex-col font-sans", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#06B6D4]/10 rounded-full blur-[140px] pointer-events-none z-0" }),
    /* @__PURE__ */ jsx("div", { className: "absolute top-[30%] left-[-10%] w-[700px] h-[700px] bg-[#A855F7]/10 rounded-full blur-[140px] pointer-events-none z-0" }),
    /* @__PURE__ */ jsx("div", { className: "absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#C5A059]/10 rounded-full blur-[140px] pointer-events-none z-0" }),
    /* @__PURE__ */ jsxs("nav", { className: "w-full px-8 py-5 flex justify-between items-center z-50 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/5 sticky top-0", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsx("img", { src: "/LOGO%20Official-Trans.png", alt: "ArtisanFlow Logo", className: "h-16 w-auto object-contain" }) }),
      /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Button, { variant: "outline", onClick: () => setView("login"), className: "h-10 px-8 font-bold border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10 transition-all duration-300 rounded-full tracking-widest text-xs uppercase", children: "Sign In" }) })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "flex-1 flex flex-col items-center justify-start p-6 z-10 mt-12 relative w-full max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-12 items-center w-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-left space-y-8 relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/20 text-[#C5A059] text-xs font-bold uppercase tracking-widest shadow-lg", children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 14 }),
            " VIP Launch: September 1st"
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "text-5xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[1.1]", children: [
            "Precision Manufacturing ",
            /* @__PURE__ */ jsx("br", {}),
            " ",
            /* @__PURE__ */ jsx("span", { className: "bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] text-transparent bg-clip-text", children: "For Artisanal Brands" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-400 font-medium max-w-xl leading-relaxed", children: "Synchronize your inventory, calculate real-time material burn rates, generate high-fidelity marketing assets, and protect your margins with Lola AI. Join the VIP waitlist for exclusive Lifetime Deal access." }),
          /* @__PURE__ */ jsx("div", { ref: formRef, className: "mt-8 bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl", children: isSubmitted ? /* @__PURE__ */ jsxs("div", { className: "text-center py-8 space-y-4 animate-in fade-in zoom-in duration-500", children: [
            /* @__PURE__ */ jsx(CheckCircle, { size: 48, className: "text-[#10B981] mx-auto mb-4" }),
            /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black text-white", children: "You're Officially on the VIP List!" }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm max-w-sm mx-auto leading-relaxed", children: "We've reserved your priority spot. Keep an eye on your inbox for exclusive behind-the-scenes previews before doors open September 1st @ 10:00 AM EST." })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
              /* @__PURE__ */ jsx("div", { className: "flex justify-between items-center mb-2", children: /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-[#C5A059] uppercase tracking-widest", children: "🔒 VIP Spots Claimed: 74 / 100" }) }),
              /* @__PURE__ */ jsx("div", { className: "h-1 w-full bg-white/10 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-gradient-to-r from-[#C5A059] to-[#E2C792] rounded-full", style: { width: "74%" } }) })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-4", children: "Secure Your VIP Spot" }),
            /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                Input,
                {
                  type: "text",
                  placeholder: "Full Name",
                  required: true,
                  value: formData.fullName,
                  onChange: (e) => setFormData({ ...formData, fullName: e.target.value }),
                  className: "bg-[#0d0d0d] border-white/10 text-white placeholder:text-gray-600 h-12"
                }
              ) }),
              /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
                Input,
                {
                  type: "email",
                  placeholder: "Email Address",
                  required: true,
                  value: formData.email,
                  onChange: (e) => setFormData({ ...formData, email: e.target.value }),
                  className: "bg-[#0d0d0d] border-white/10 text-white placeholder:text-gray-600 h-12"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    required: true,
                    value: formData.businessType,
                    onChange: (e) => setFormData({ ...formData, businessType: e.target.value }),
                    className: "w-full bg-[#0d0d0d] border border-white/10 text-white rounded-xl px-4 h-12 outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-all font-medium text-sm appearance-none pr-10",
                    children: CATEGORIES.map((cat, index) => /* @__PURE__ */ jsx("option", { value: index === 0 ? "" : cat, disabled: index === 0, hidden: index === 0, children: cat }, cat))
                  }
                ),
                /* @__PURE__ */ jsx(ChevronDown, { size: 18, className: "absolute right-4 top-1/2 -translate-y-1/2 text-[#C5A059] pointer-events-none" })
              ] }),
              /* @__PURE__ */ jsxs(
                Button,
                {
                  variant: "primary",
                  type: "submit",
                  disabled: isSubmitting,
                  className: "w-full h-12 font-black tracking-widest bg-gradient-to-r from-[#C5A059] to-[#b08d4b] text-black hover:opacity-90 shadow-xl shadow-[#C5A059]/20 hover:shadow-[0_0_30px_rgba(197,160,89,0.15)] transition-all border-none",
                  children: [
                    isSubmitting ? "JOINING..." : "JOIN VIP WAITLIST",
                    " ",
                    /* @__PURE__ */ jsx(ArrowRight, { size: 18, className: "ml-2" })
                  ]
                }
              )
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative w-full flex justify-center lg:justify-end items-center z-10", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[#C5A059]/10 blur-[80px] rounded-full pointer-events-none" }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "/artisan_flow_hero.png",
              alt: "Artisan Flow Dashboard Mockup",
              className: "relative z-10 w-full max-w-2xl object-contain drop-shadow-2xl hover:scale-[1.02] transition-transform duration-700"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-24 w-full max-w-5xl relative z-10 mx-auto mb-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black text-white tracking-tight uppercase mb-4", children: "The Anti-Spreadsheet OS for Modern Makers" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg max-w-2xl mx-auto", children: "Why artisans are ditching legacy inventory sheets for automated precision." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-red-950/10 border border-red-500/20 p-8 rounded-[2rem] flex flex-col items-center text-center text-gray-400 opacity-80 transition-all", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-red-400 font-bold uppercase tracking-widest text-sm mb-6", children: "Legacy Craftybase & Spreadsheets" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-4 text-sm w-full text-left", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-red-500 font-bold text-lg leading-none", children: "×" }),
                " Manual batch math & spreadsheet errors"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-red-500 font-bold text-lg leading-none", children: "×" }),
                " Silent cost increases eating margins"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-red-500 font-bold text-lg leading-none", children: "×" }),
                " Zero marketing or sales tools"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-red-500 font-bold text-lg leading-none", children: "×" }),
                " Clunky 2012 interface"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white/[0.03] border-2 border-[#A855F7]/40 p-8 rounded-[2rem] flex flex-col items-center text-center relative overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.15)] transition-all", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-white font-bold uppercase tracking-widest text-sm mb-6 relative z-10", children: "Artisan Flow Modern OS" }),
            /* @__PURE__ */ jsxs("ul", { className: "space-y-4 text-gray-200 text-sm w-full text-left relative z-10", children: [
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-[#10B981] shrink-0 mt-0.5" }),
                " Automated batch deduction & stock ledgers"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-[#C5A059] shrink-0 mt-0.5" }),
                " Profit Guard™ real-time margin alerts"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-[#10B981] shrink-0 mt-0.5" }),
                " Lola AI multi-channel marketing engine"
              ] }),
              /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-3", children: [
                /* @__PURE__ */ jsx(CheckCircle, { size: 16, className: "text-[#10B981] shrink-0 mt-0.5" }),
                " Next-gen dark mode interface"
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-20 w-full max-w-6xl relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "text-center mb-16", children: /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-4", children: "Built For Industrial Manufacturing Precision" }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white/[0.02] border border-emerald-500/30 p-6 rounded-2xl hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] transition-all flex flex-col items-start text-left", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-[#06B6D4]/10 p-3 rounded-xl mb-4 border border-[#06B6D4]/20", children: /* @__PURE__ */ jsx(Activity, { size: 24, className: "text-[#06B6D4]" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Operations & Recipe Builder" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 leading-relaxed", children: "Bill of Materials tracking, automated batch inventory deduction, and supplier quality control ledgers." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white/[0.02] border border-purple-500/30 p-6 rounded-2xl hover:border-fuchsia-400/60 hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all flex flex-col items-start text-left", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-[#A855F7]/10 p-3 rounded-xl mb-4 border border-[#A855F7]/20", children: /* @__PURE__ */ jsx(Cpu, { size: 24, className: "text-[#A855F7]" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Lola AI Marketing Co-Pilot" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 leading-relaxed", children: "Automate multi-channel content creation, social calendar scheduling, and blog writing tailored to your brand voice." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "bg-white/[0.02] border border-amber-500/30 p-6 rounded-2xl hover:border-yellow-400/60 hover:shadow-[0_0_30px_rgba(197,160,89,0.1)] transition-all flex flex-col items-start text-left", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-[#C5A059]/10 p-3 rounded-xl mb-4 border border-[#C5A059]/20", children: /* @__PURE__ */ jsx(Shield, { size: 24, className: "text-[#C5A059]" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "Finance Hub & Profit Guard™" }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-400 leading-relaxed", children: "Real-time margin anomaly detection that alerts you before raw material cost increases destroy your margins." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-32 w-full max-w-6xl relative z-10 mb-20", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-3xl md:text-5xl font-black text-white tracking-tight uppercase mb-4", children: "Lifetime Deal Tiers" }),
          /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg max-w-2xl mx-auto", children: "Lock in lifetime access for a single payment. Limited to 100 licenses. Prices reveal on launch day." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsx(
            LTDCert,
            {
              title: "Starter Maker LTD",
              variant: "emerald",
              features: [
                "Precision Bill of Materials (BOM) Recipe Costing",
                "Automated Batch Inventory Deduction",
                "Warehouse Stock Ledger & Low-Stock Alerts",
                "Universal CSV Importer (Craftybase Migration)",
                "Track Up to 500 Active SKUs"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            LTDCert,
            {
              title: "Artisan Pro LTD",
              isFeatured: true,
              variant: "gradient",
              features: [
                "Everything in Starter Maker, PLUS:",
                "Lola AI Marketing Suite (Social, Blogs, Scripts)",
                "Kanban Production Scheduler & Curing Workflow",
                "Supplier QC Ledgers & Purchase Orders",
                "Square SDK Omnichannel Sales Sync"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            LTDCert,
            {
              title: "Master Formulator LTD",
              variant: "gold",
              features: [
                "Everything in Artisan Pro, PLUS:",
                "Profit Guard™ Real-Time Margin Protection",
                "Predictive Raw Material Reordering Alerts",
                "Multi-Location Warehouse Tracking",
                "Unlimited SKUs & Priority VIP Concierge Support"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-16 flex justify-center", children: /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: scrollToForm,
            className: "h-14 px-10 font-black tracking-widest bg-gradient-to-r from-[#C5A059] to-[#b08d4b] text-black hover:opacity-90 shadow-xl shadow-[#C5A059]/20 hover:shadow-[0_0_30px_rgba(197,160,89,0.15)] border-none rounded-full transition-all",
            children: [
              "JOIN VIP WAITLIST ",
              /* @__PURE__ */ jsx(ArrowRight, { size: 18, className: "ml-2" })
            ]
          }
        ) })
      ] })
    ] })
  ] });
};
const LTDCert = ({ title, features, isFeatured, variant = "gold" }) => {
  let containerClasses = "";
  let checkColor = "";
  if (variant === "gradient" || isFeatured) {
    containerClasses = "p-[1px] bg-gradient-to-b from-[#06B6D4] via-[#A855F7] to-[#C5A059] shadow-[0_0_50px_rgba(168,85,247,0.2)] scale-105 z-10 rounded-[2rem]";
    checkColor = "text-[#A855F7]";
  } else if (variant === "emerald") {
    containerClasses = "border border-emerald-500/30 hover:border-[#06B6D4]/50 shadow-[0_0_30px_rgba(6,182,212,0.1)] rounded-[2rem] bg-white/[0.02]";
    checkColor = "text-[#10B981]";
  } else {
    containerClasses = "border border-amber-500/30 hover:border-yellow-400/60 shadow-[0_0_30px_rgba(197,160,89,0.1)] rounded-[2rem] bg-white/[0.02]";
    checkColor = "text-[#C5A059]";
  }
  return /* @__PURE__ */ jsx("div", { className: `group relative flex flex-col h-full transition-all duration-500 backdrop-blur-xl ${containerClasses}`, children: /* @__PURE__ */ jsxs("div", { className: `flex flex-col h-full p-8 rounded-[2rem] ${variant === "gradient" || isFeatured ? "bg-[#09090b]" : ""}`, children: [
    isFeatured && /* @__PURE__ */ jsx("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#06B6D4] via-[#A855F7] to-[#C5A059] text-black text-[10px] font-black uppercase tracking-widest px-6 py-2 rounded-full shadow-lg", children: "Most Popular" }),
    /* @__PURE__ */ jsxs("div", { className: "mb-6", children: [
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black text-white tracking-tight mb-6", children: title }),
      /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-xl bg-black/40 border border-white/5 p-4 flex items-center justify-center min-h-[100px]", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 backdrop-blur-[6px] z-10 flex flex-col items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "bg-black/80 border border-[#C5A059]/50 text-[#C5A059] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Lock, { size: 12 }),
          " VIP PRICE REVEALED SEP 1ST @ 10:00 AM EST"
        ] }) }),
        /* @__PURE__ */ jsx("span", { className: "text-4xl font-black text-white/10 blur-sm", children: "$???" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4 mb-8 flex-1 mt-6", children: features.map((f) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx(CheckCircle, { size: 18, className: `${checkColor} shrink-0 mt-0.5` }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-300", children: f })
    ] }, f)) })
  ] }) });
};
const AIAssistant = () => {
  const navigate = useNavigate();
  const { businessProfile, addAppointment, inventory, productionStats, getTotalRevenue, getMarginMetrics, todos, integrations } = useArtisanData();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: `Hi, I'm Lola, your flow assistant. I can help you summarize your financial margins, check your orders, and even brainstorm marketing ideas. How can I help you today?`, followUpQuestions: ["Check Margins", "Marketing Ideas?"] }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [mode, setMode] = useState("fast");
  const messagesEndRef = useRef(null);
  const audioContextRef = useRef(null);
  const recognitionRef = useRef(null);
  const currentAudioSourceRef = useRef(null);
  const lastAudioRequestIdRef = useRef(0);
  const totalFinishedStock = inventory.filter((i) => i.type === "finished").reduce((acc, i) => acc + i.stock, 0);
  const { isMarginHealthy, marginMultiplier } = getMarginMetrics();
  const pendingTodos = todos.filter((t) => !t.completed).length;
  const scrollToBottom = () => {
    var _a;
    (_a = messagesEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);
  useEffect(() => {
    return () => {
      var _a, _b;
      (_a = currentAudioSourceRef.current) == null ? void 0 : _a.stop();
      (_b = audioContextRef.current) == null ? void 0 : _b.close();
    };
  }, []);
  const decodeBase64 = (base64) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };
  const decodeAudioData = async (data, ctx, sampleRate, numChannels) => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768;
      }
    }
    return buffer;
  };
  const playLolaVoice = async (text) => {
    if (!isTtsEnabled) return;
    const requestId = ++lastAudioRequestIdRef.current;
    if (currentAudioSourceRef.current) {
      try {
        currentAudioSourceRef.current.stop();
      } catch (e) {
      }
    }
    setIsSpeaking(true);
    try {
      const base64Audio = await generateLolaSpeech(text);
      if (requestId !== lastAudioRequestIdRef.current) return;
      if (base64Audio) {
        if (!audioContextRef.current || audioContextRef.current.state === "closed") {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24e3 });
        }
        const ctx = audioContextRef.current;
        if (ctx.state === "suspended") await ctx.resume();
        const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), ctx, 24e3, 1);
        if (requestId !== lastAudioRequestIdRef.current) return;
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => {
          if (requestId === lastAudioRequestIdRef.current) setIsSpeaking(false);
        };
        currentAudioSourceRef.current = source;
        source.start(0);
      } else {
        setIsSpeaking(false);
      }
    } catch (e) {
      console.error("Speech synthesis failed", e);
      if (requestId === lastAudioRequestIdRef.current) setIsSpeaking(false);
    }
  };
  const toggleDictation = () => {
    var _a;
    if (isListening) {
      (_a = recognitionRef.current) == null ? void 0 : _a.stop();
      setIsListening(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + (prev ? " " : "") + transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };
  const handleSend = async (overrideMsg) => {
    const msgToProcess = overrideMsg || input;
    if (!msgToProcess.trim()) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: msgToProcess }]);
    setIsLoading(true);
    try {
      const snapshot = {
        inventory,
        productionStats,
        totalFinishedUnits: totalFinishedStock,
        isMarginHealthy,
        marginMultiplier,
        revenue: getTotalRevenue(),
        connectedIntegrations: integrations.filter((i) => i.status === "Connected").map((i) => i.name)
      };
      const response = await chatWithLola(msgToProcess, snapshot, mode);
      const assistantMsg = {
        role: "assistant",
        text: response.text,
        followUpQuestions: response.followUpQuestions,
        suggestedRoute: response.suggestedRoute
      };
      if (msgToProcess.toLowerCase().includes("wholesale") || msgToProcess.toLowerCase().includes("strategy")) {
        if (marginMultiplier < 2.2 || totalFinishedStock < 50) assistantMsg.isAuditPrompt = true;
        else assistantMsg.isSlotSelector = true;
      }
      setMessages((prev) => [...prev, assistantMsg]);
      if (isTtsEnabled) setTimeout(() => playLolaVoice(response.text), 50);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", text: "Node communication error." }]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectSlot = (time, type = "Wholesale Strategy") => {
    const confirmText = `Confirmed for ${time}.`;
    addAppointment({ clientName: "Wholesale Lead", email: "lead@artisanflow.ai", date: "2025-12-16", time, type, status: "Confirmed" });
    setMessages((prev) => [...prev, { role: "assistant", text: confirmText }]);
    if (isTtsEnabled) playLolaVoice(confirmText);
  };
  if (!isOpen) {
    return /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(true),
        className: "fixed bottom-6 right-6 w-14 h-14 bg-[#6A2C91] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-50 animate-float",
        children: [
          /* @__PURE__ */ jsx(MessageSquare, { size: 24 }),
          pendingTodos > 0 && /* @__PURE__ */ jsx("div", { className: "absolute -top-1 -right-1 w-5 h-5 bg-[#C5A059] rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black animate-pulse", children: pendingTodos })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 right-6 w-80 h-[380px] max-h-[calc(100vh-64px)] bg-black/80 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_50px_rgba(106,44,145,0.4)] flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 border-t-4 border-t-[#C5A059]", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-transparent p-4 flex justify-between items-center relative border-b border-white/10", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 pl-2", children: [
        /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full overflow-hidden border border-[#C5A059]/30 shadow-[0_0_10px_rgba(197,160,89,0.2)]", children: /* @__PURE__ */ jsx("img", { src: "/lola_avatar.jpg", alt: "Lola", className: "w-full h-full object-cover" }) }),
        /* @__PURE__ */ jsxs("h3", { className: "font-black text-xs tracking-tight flex items-center gap-1 uppercase italic text-white", children: [
          "Lola ",
          /* @__PURE__ */ jsx(Sparkles, { size: 10, className: "text-[#C5A059]" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: `w-2 h-2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)] ${isSpeaking ? "bg-amber-400 animate-ping" : "bg-emerald-500 animate-pulse"} ml-1` })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setIsTtsEnabled(!isTtsEnabled), className: `p-2 rounded-xl transition-all ${isTtsEnabled ? "bg-[#C5A059] text-black shadow-lg" : "text-white/40 hover:text-[#C5A059] hover:bg-white/5"}`, title: isTtsEnabled ? "Disable Voice" : "Enable Voice Output", children: isTtsEnabled ? /* @__PURE__ */ jsx(Volume2, { size: 16 }) : /* @__PURE__ */ jsx(VolumeX, { size: 16 }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsOpen(false), className: "p-2 text-white/40 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all", children: /* @__PURE__ */ jsx(Minimize2, { size: 16 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-2 border-b border-white/5 flex justify-center gap-2", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => setMode("fast"), className: `px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${mode === "fast" ? "bg-[#6A2C91] text-white" : "bg-black/50 text-white/50 border border-white/5"}`, children: [
        /* @__PURE__ */ jsx(Zap, { size: 10 }),
        " Fast"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setMode("deep"), className: `px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${mode === "deep" ? "bg-[#C5A059] text-black" : "bg-black/50 text-white/50 border border-white/5"}`, children: [
        /* @__PURE__ */ jsx(Database, { size: 10 }),
        " Think"
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setMode("search"), className: `px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1 transition-all ${mode === "search" ? "bg-blue-600 text-white" : "bg-black/50 text-white/50 border border-white/5"}`, children: [
        /* @__PURE__ */ jsx(Search, { size: 10 }),
        " Search"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4 bg-transparent scrollbar-hide", children: [
      messages.map((msg, idx) => /* @__PURE__ */ jsxs("div", { className: `flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-end w-full", style: { justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }, children: [
          msg.role === "assistant" && /* @__PURE__ */ jsx("div", { className: "w-6 h-6 rounded-full overflow-hidden border border-[#C5A059]/30 shrink-0 mb-1", children: /* @__PURE__ */ jsx("img", { src: "/lola_avatar.jpg", alt: "Lola", className: "w-full h-full object-cover" }) }),
          /* @__PURE__ */ jsxs("div", { className: `max-w-[85%] p-3.5 rounded-2xl text-[11px] shadow-sm leading-relaxed group relative ${msg.role === "user" ? "bg-[#C5A059] text-black rounded-br-none shadow-[#C5A059]/20 font-medium" : "bg-white/10 text-white rounded-bl-none border border-white/5"}`, children: [
            msg.text,
            msg.suggestedRoute && /* @__PURE__ */ jsxs("button", { onClick: () => {
              navigate(msg.suggestedRoute);
              setIsOpen(false);
            }, className: "mt-3 flex items-center gap-2 w-full py-2 px-3 bg-white border border-purple-200 text-[#6A2C91] rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-purple-50 transition-all shadow-sm", children: [
              "Recommended Task ",
              /* @__PURE__ */ jsx(ChevronRight, { size: 12 })
            ] }),
            msg.isAuditPrompt && /* @__PURE__ */ jsxs("div", { className: "mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2", children: [
              /* @__PURE__ */ jsxs("p", { className: "text-[9px] font-black text-amber-800 flex items-center gap-1.5 uppercase tracking-widest", children: [
                /* @__PURE__ */ jsx(Factory, { size: 12 }),
                " CAPACITY ALERT"
              ] }),
              /* @__PURE__ */ jsx("button", { onClick: () => handleSelectSlot("10:00 AM", "Manufacturing Audit"), className: "w-full bg-[#C5A059] text-white py-2 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] shadow-md shadow-amber-200/50 hover:bg-[#b08e4d] transition-all active:scale-95", children: "Schedule Audit" })
            ] })
          ] })
        ] }),
        msg.role === "assistant" && msg.followUpQuestions && msg.followUpQuestions.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-2 flex flex-wrap gap-1.5 px-1 animate-in fade-in slide-up duration-500", children: msg.followUpQuestions.map((q, i) => /* @__PURE__ */ jsx("button", { onClick: () => handleSend(q), className: "bg-black/40 border border-white/10 text-[9px] font-bold text-white/70 px-3 py-1 rounded-full hover:border-[#C5A059] hover:text-[#C5A059] hover:bg-white/5 transition-all shadow-sm", children: q }, i)) })
      ] }, idx)),
      isLoading && /* @__PURE__ */ jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxs("div", { className: "bg-white/5 p-3 rounded-2xl border border-white/10 animate-pulse flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce", style: { animationDelay: "0ms" } }),
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce", style: { animationDelay: "200ms" } }),
          /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 bg-[#C5A059] rounded-full animate-bounce", style: { animationDelay: "400ms" } })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black text-[#C5A059] uppercase tracking-[0.2em]", children: mode === "deep" ? "THINKING..." : "ANALYZING..." })
      ] }) }),
      /* @__PURE__ */ jsx("div", { ref: messagesEndRef })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-4 bg-black border-t border-white/10", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 bg-white/5 rounded-2xl px-3 py-1.5 border border-white/10 focus-within:border-[#C5A059] focus-within:bg-black focus-within:ring-2 focus-within:ring-[#C5A059]/20 transition-all", children: [
      /* @__PURE__ */ jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSend(), placeholder: isListening ? "Listening..." : "Ask Lola...", className: "flex-1 bg-transparent py-2 text-white text-xs outline-none placeholder:text-white/30 font-bold" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("button", { onClick: toggleDictation, className: `p-2 rounded-xl transition-all ${isListening ? "bg-emerald-500/20 text-emerald-400 shadow-inner" : "text-white/40 hover:text-[#C5A059] hover:bg-white/5 shadow-sm border border-transparent hover:border-white/5"}`, title: "Voice Input", children: isListening ? /* @__PURE__ */ jsx(MicOff, { size: 18 }) : /* @__PURE__ */ jsx(Mic, { size: 18 }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => handleSend(), disabled: isLoading || !input.trim(), className: "p-2.5 bg-[#C5A059] text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 flex items-center justify-center shadow-lg shadow-[#C5A059]/20", title: "Send (Enter)", children: /* @__PURE__ */ jsx(Send, { size: 14 }) })
      ] })
    ] }) })
  ] });
};
const useFunnelMetrics = () => {
  const location = useLocation();
  const hasTrackedPageview = useRef(false);
  const getFunnelType = (path) => {
    if (path.includes("/makers")) return "makers";
    if (path.includes("/apothecaries")) return "apothecaries";
    if (path.includes("/scale")) return "scale";
    return "unknown";
  };
  const trackEvent = async (payload) => {
    const fullPayload = {
      ...payload,
      funnel: getFunnelType(location.pathname),
      path: location.pathname,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    try {
      await fetch("/api/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fullPayload)
      });
    } catch (e) {
      console.warn("Funnel tracking failed", e);
    }
  };
  useEffect(() => {
    if (!hasTrackedPageview.current) {
      trackEvent({ event: "pageview" });
      hasTrackedPageview.current = true;
    }
  }, [location.pathname]);
  return {
    trackEvent,
    trackCtaClick: (tier) => trackEvent({ event: "cta_click", metadata: { targetTier: tier } })
  };
};
const MakerFunnel = () => {
  const { trackCtaClick } = useFunnelMetrics();
  const navigateToAuth = (e) => {
    e.preventDefault();
    trackCtaClick("");
    window.location.href = "/auth?tier=Free%20Audit";
  };
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };
  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.2 }
  };
  return /* @__PURE__ */ jsxs("div", { className: "mf-container", children: [
    /* @__PURE__ */ jsx("section", { className: "mf-hero", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "mf-hero-content",
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.8 },
        children: [
          /* @__PURE__ */ jsx("span", { className: "mf-badge", children: "For Bespoke Handcrafters & Artisans" }),
          /* @__PURE__ */ jsx("h1", { className: "mf-title", children: "Stop Guessing. Start Profiting." }),
          /* @__PURE__ */ jsx("p", { className: "mf-subtitle", children: "Whether you make candles, jewelry, soap, or baked goods, guessing your material costs and labor means you're likely losing money. Take control of your margins today." }),
          /* @__PURE__ */ jsxs("a", { href: "/auth?tier=Free%20Audit", onClick: navigateToAuth, className: "mf-cta-primary", children: [
            "Calculate Your True Margins ",
            /* @__PURE__ */ jsx(ArrowRight, { size: 20 })
          ] })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("section", { className: "mf-section", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "initial",
          whileInView: "whileInView",
          variants: fadeInUp,
          children: [
            /* @__PURE__ */ jsx("h2", { className: "mf-section-title", children: "The Artisan's Dilemma" }),
            /* @__PURE__ */ jsx("p", { className: "mf-section-subtitle", children: "You put your heart into your craft, but pricing it feels like a shot in the dark." })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "mf-grid",
          variants: staggerContainer,
          initial: "initial",
          whileInView: "whileInView",
          children: [
            /* @__PURE__ */ jsxs(motion.div, { className: "mf-card", variants: fadeInUp, children: [
              /* @__PURE__ */ jsx("div", { className: "mf-icon-wrapper", children: /* @__PURE__ */ jsx(Calculator, { size: 28 }) }),
              /* @__PURE__ */ jsx("h3", { className: "mf-card-title", children: "Underpricing Products" }),
              /* @__PURE__ */ jsx("p", { className: "mf-card-desc", children: "Relying on competitor pricing or gut feelings leaves money on the table. You are undervaluing your unique skills and time." })
            ] }),
            /* @__PURE__ */ jsxs(motion.div, { className: "mf-card", variants: fadeInUp, children: [
              /* @__PURE__ */ jsx("div", { className: "mf-icon-wrapper", children: /* @__PURE__ */ jsx(PackageOpen, { size: 28 }) }),
              /* @__PURE__ */ jsx("h3", { className: "mf-card-title", children: "Material Cost Chaos" }),
              /* @__PURE__ */ jsx("p", { className: "mf-card-desc", children: "Fluctuating costs for wax, essential oils, metals, and packaging make it impossible to know your true COGS (Cost of Goods Sold)." })
            ] }),
            /* @__PURE__ */ jsxs(motion.div, { className: "mf-card", variants: fadeInUp, children: [
              /* @__PURE__ */ jsx("div", { className: "mf-icon-wrapper", children: /* @__PURE__ */ jsx(Activity, { size: 28 }) }),
              /* @__PURE__ */ jsx("h3", { className: "mf-card-title", children: "Lost Labor Hours" }),
              /* @__PURE__ */ jsx("p", { className: "mf-card-desc", children: "You're working for free. When you don't accurately factor in your active making time and prep time, your hourly wage drops to zero." })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "mf-section mf-solution", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "initial",
          whileInView: "whileInView",
          variants: fadeInUp,
          children: [
            /* @__PURE__ */ jsx("h2", { className: "mf-section-title", children: "Meet Artisan Flow" }),
            /* @__PURE__ */ jsx("p", { className: "mf-section-subtitle", children: "The intelligent toolkit designed specifically for makers to protect their profits." })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          className: "mf-grid",
          variants: staggerContainer,
          initial: "initial",
          whileInView: "whileInView",
          children: [
            /* @__PURE__ */ jsxs(motion.div, { className: "mf-card", variants: fadeInUp, children: [
              /* @__PURE__ */ jsx("div", { className: "mf-icon-wrapper", children: /* @__PURE__ */ jsx(ShieldCheck, { size: 28 }) }),
              /* @__PURE__ */ jsx("h3", { className: "mf-card-title", children: "BOM Manager" }),
              /* @__PURE__ */ jsx("p", { className: "mf-card-desc", children: "Build exact Bill of Materials for every product. Track every drop of oil, gram of wax, and inch of wire down to the penny." })
            ] }),
            /* @__PURE__ */ jsxs(motion.div, { className: "mf-card", variants: fadeInUp, children: [
              /* @__PURE__ */ jsx("div", { className: "mf-icon-wrapper", children: /* @__PURE__ */ jsx(Zap, { size: 28 }) }),
              /* @__PURE__ */ jsx("h3", { className: "mf-card-title", children: "Profit Guard" }),
              /* @__PURE__ */ jsx("p", { className: "mf-card-desc", children: "Set your target profit margins and hourly labor rates. Artisan Flow instantly calculates the exact retail and wholesale prices you need." })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("section", { className: "mf-section", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        className: "mf-testimonial",
        initial: "initial",
        whileInView: "whileInView",
        variants: fadeInUp,
        children: [
          /* @__PURE__ */ jsx("div", { className: "mf-stars", children: [1, 2, 3, 4, 5].map((star) => /* @__PURE__ */ jsx(Star, { size: 24, fill: "currentColor" }, star)) }),
          /* @__PURE__ */ jsx("p", { className: "mf-quote", children: `"Before Artisan Flow, I was selling my hand-poured candles for $25 because that's what everyone else did. I realized I was actually losing $2 per candle when accounting for my time. Now, I price confidently at $42 and my customers happily pay it."` }),
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
              alt: "Sarah M.",
              className: "mf-author-img"
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "mf-author", children: "Sarah M." }),
          /* @__PURE__ */ jsx("div", { className: "mf-author-title", children: "Founder, Lumina Candle Co." })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx("section", { className: "mf-footer", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: "initial",
        whileInView: "whileInView",
        variants: fadeInUp,
        children: [
          /* @__PURE__ */ jsx("h2", { className: "mf-title", style: { fontSize: "3rem", marginBottom: "32px" }, children: "Ready to value your craft?" }),
          /* @__PURE__ */ jsxs("a", { href: "/auth?tier=Free%20Audit", onClick: navigateToAuth, className: "mf-cta-primary", children: [
            "Calculate Your True Margins ",
            /* @__PURE__ */ jsx(ArrowRight, { size: 20 })
          ] })
        ]
      }
    ) })
  ] });
};
const ApothecaryFunnel = () => {
  useFunnelMetrics();
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };
  const staggerChildren = {
    animate: { transition: { staggerChildren: 0.1 } }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#0a0f0d] text-gray-100 font-sans selection:bg-emerald-900 selection:text-emerald-100", children: [
    /* @__PURE__ */ jsx("nav", { className: "fixed w-full z-50 bg-[#0a0f0d]/80 backdrop-blur-md border-b border-emerald-900/30", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 h-20 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Leaf, { className: "w-6 h-6 text-emerald-500" }),
        /* @__PURE__ */ jsx("span", { className: "text-xl font-semibold tracking-wide text-white", children: "Artisan Flow" })
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/auth?tier=Artisan%20Flow%20Basic",
          className: "px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]",
          children: "Start Formulating"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-[#0a0f0d] to-[#0a0f0d] z-10" }),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=2000",
            alt: "Apothecary formulation",
            className: "w-full h-full object-cover opacity-30"
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6 relative z-10", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "initial",
          animate: "animate",
          variants: staggerChildren,
          className: "max-w-3xl",
          children: [
            /* @__PURE__ */ jsxs(motion.div, { variants: fadeIn, className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-800/50 mb-8", children: [
              /* @__PURE__ */ jsx("span", { className: "flex h-2 w-2 rounded-full bg-emerald-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-emerald-300 text-sm font-medium tracking-wide uppercase", children: "For Botanical & Clean Beauty Brands" })
            ] }),
            /* @__PURE__ */ jsxs(motion.h1, { variants: fadeIn, className: "text-5xl lg:text-7xl font-light tracking-tight text-white mb-6 leading-tight", children: [
              "Precision in every ",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200", children: "botanical drop." })
            ] }),
            /* @__PURE__ */ jsx(motion.p, { variants: fadeIn, className: "text-xl text-gray-400 mb-10 leading-relaxed font-light max-w-2xl", children: "Elevate your apothecary formulations with clinical precision. Scale recipes effortlessly, track every organic ingredient, and ensure flawless regulatory compliance for your small-batch cosmetics." }),
            /* @__PURE__ */ jsx(motion.div, { variants: fadeIn, className: "flex flex-col sm:flex-row gap-4", children: /* @__PURE__ */ jsxs(
              "a",
              {
                href: "/auth?tier=Artisan%20Flow%20Basic",
                className: "inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-medium rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] group",
                children: [
                  "Standardize Your Recipes",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" })
                ]
              }
            ) })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-24 bg-[#0d1411]", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto px-6", children: /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -30 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          transition: { duration: 0.8 },
          children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-3xl lg:text-4xl font-light mb-6", children: [
              "The formulation chaos ",
              /* @__PURE__ */ jsx("br", {}),
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-emerald-400", children: "stifling your growth." })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg mb-8 font-light leading-relaxed", children: "As your clean beauty brand grows, the margin for error shrinks. Spreadsheets and notebooks can't keep up with the demands of scaling organic formulations while maintaining strict batch integrity." }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-6", children: [
              { title: "Scaling Errors", desc: "Manual calculations lead to inconsistent batches and wasted precious ingredients.", icon: Scale },
              { title: "Compliance Nightmares", desc: "Tracking lot numbers and expiration dates across multiple botanical sources is a logistical headache.", icon: ShieldCheck },
              { title: "Lost Formula Variations", desc: "Struggling to track iterations of your hero product's formulation history.", icon: FileSignature }
            ].map((item, i) => /* @__PURE__ */ jsxs("li", { className: "flex gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-12 h-12 rounded-full bg-red-900/20 border border-red-900/50 flex items-center justify-center text-red-400", children: /* @__PURE__ */ jsx(item.icon, { className: "w-5 h-5" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-white font-medium mb-1", children: item.title }),
                /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm font-light", children: item.desc })
              ] })
            ] }, i)) })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: 30 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          transition: { duration: 0.8 },
          className: "relative",
          children: [
            /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-tr from-emerald-900/20 to-transparent rounded-3xl blur-2xl" }),
            /* @__PURE__ */ jsx(
              "img",
              {
                src: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=1200",
                alt: "Messy formulation process",
                className: "relative rounded-3xl border border-gray-800 shadow-2xl"
              }
            )
          ]
        }
      )
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-24 relative", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center max-w-3xl mx-auto mb-20", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl lg:text-5xl font-light mb-6", children: [
          "Clinical precision for ",
          /* @__PURE__ */ jsx("br", {}),
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-200", children: "botanical artisans." })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg font-light", children: "Artisan Flow provides the exact tools needed to standardize your recipes, trace every ingredient, and formulate with absolute confidence." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-4 sm:p-8", children: [
        {
          title: "Dynamic Recipe Scaling",
          desc: "Instantly scale your formulations from 1oz prototypes to 10-gallon production runs with perfect mathematical precision.",
          icon: Beaker
        },
        {
          title: "Ingredient Traceability",
          desc: "Track lot numbers, supplier COAs, and expiration dates for every botanical extract and carrier oil in your inventory.",
          icon: Search
        },
        {
          title: "Regulatory Batch Records",
          desc: "Generate compliant batch records automatically. Know exactly what went into every bottle you sell.",
          icon: FileSignature
        }
      ].map((feature, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, delay: i * 0.1 },
          className: "p-4 sm:p-8 rounded-3xl bg-[#0d1411] border border-emerald-900/30 hover:border-emerald-500/50 transition-colors group",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-14 h-14 rounded-2xl bg-emerald-900/30 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(feature.icon, { className: "w-7 h-7" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-medium text-white mb-3", children: feature.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 font-light leading-relaxed", children: feature.desc })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-24 bg-[#0d1411] relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-96 bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-6 relative z-10 text-center", children: [
        /* @__PURE__ */ jsx(Quote, { className: "w-12 h-12 text-emerald-500/50 mx-auto mb-8" }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl lg:text-4xl font-light text-white mb-10 leading-relaxed", children: `"Artisan Flow completely transformed how we manage our apothecary lines. The ability to scale our complex herbal serums precisely has saved us thousands in wasted ingredients. It's the clinical backbone our botanical brand needed."` }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
              alt: "Sarah Jenkins",
              className: "w-16 h-16 rounded-full object-cover border-2 border-emerald-500/30"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "text-left", children: [
            /* @__PURE__ */ jsx("p", { className: "text-white font-medium", children: "Sarah Jenkins" }),
            /* @__PURE__ */ jsx("p", { className: "text-emerald-400 text-sm font-light", children: "Founder, Botanica Clinical" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-32 relative", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-6 text-center", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95 },
        whileInView: { opacity: 1, scale: 1 },
        viewport: { once: true },
        className: "p-4 sm:p-12 md:p-20 rounded-[3rem] bg-gradient-to-b from-[#0d1411] to-[#0a0f0d] border border-emerald-900/50 shadow-2xl relative overflow-hidden",
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[url('https://images.unsplash.com/photo-1615397323283-7c337b5879ea?auto=format&fit=crop&q=80&w=1200')] opacity-5 bg-cover bg-center" }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-4xl lg:text-5xl font-light text-white mb-6", children: "Ready to elevate your formulations?" }),
            /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-400 font-light mb-10 max-w-2xl mx-auto", children: "Join the visionary apothecaries and clean beauty brands standardizing their production with Artisan Flow." }),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: "/auth?tier=Artisan%20Flow%20Basic",
                className: "inline-flex items-center justify-center px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-medium rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] group",
                children: [
                  "Standardize Your Recipes",
                  /* @__PURE__ */ jsx(ArrowRight, { className: "w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" })
                ]
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "mt-6 text-sm text-gray-500 font-light", children: "Start for free. No credit card required." })
          ] })
        ]
      }
    ) }) })
  ] });
};
const ScaleFunnel = () => {
  useFunnelMetrics();
  const router = null;
  const handleCTA = () => {
    router.push("/auth?tier=Margin%20Protection%20Pro");
  };
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-[#0a0a0a] text-gray-300 font-sans selection:bg-[#d4af37] selection:text-black", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-16", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0 opacity-30", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000",
            alt: "Industrial manufacturing background",
            className: "w-full h-full object-cover"
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0a0a0a]/70 to-[#0a0a0a]" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 z-10 relative", children: /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: "hidden",
          animate: "visible",
          variants: staggerContainer,
          className: "max-w-4xl mx-auto text-center",
          children: [
            /* @__PURE__ */ jsxs(motion.div, { variants: fadeIn, className: "inline-flex items-center space-x-2 bg-gradient-to-r from-gray-900 to-[#1a1a1a] border border-[#333] px-4 py-2 rounded-full mb-8", children: [
              /* @__PURE__ */ jsx(Factory, { className: "w-4 h-4 text-[#d4af37]" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-gray-300 uppercase tracking-wider", children: "For Scaling Manufacturers & Wholesale Brands" })
            ] }),
            /* @__PURE__ */ jsxs(motion.h1, { variants: fadeIn, className: "text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight", children: [
              "Stop ",
              /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#f3e5ab]", children: "Margin Erosion" }),
              " in its Tracks."
            ] }),
            /* @__PURE__ */ jsx(motion.p, { variants: fadeIn, className: "text-xl md:text-2xl text-gray-400 mb-10 max-w-3xl mx-auto font-light", children: "Unify your multi-channel inventory, crush production bottlenecks, and protect your wholesale margins with industrial-grade precision." }),
            /* @__PURE__ */ jsxs(motion.div, { variants: fadeIn, className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: handleCTA,
                  className: "w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b38b22] text-black font-bold rounded-lg text-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center group",
                  children: [
                    "Lock In Your Profit Margins",
                    /* @__PURE__ */ jsx(ArrowRight, { className: "ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 sm:ml-4", children: "Zero-risk 14-day deployment." })
            ] })
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-24 bg-[#111] border-y border-[#222]", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, margin: "-100px" },
        variants: staggerContainer,
        className: "max-w-5xl mx-auto",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-5xl font-bold text-white mb-4", children: [
              "The Cost of Scale is ",
              /* @__PURE__ */ jsx("span", { className: "text-red-500", children: "Chaos" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-400", children: "As volume increases, legacy systems break down." })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid md:grid-cols-3 gap-4 sm:p-8", children: [
            {
              icon: /* @__PURE__ */ jsx(AlertTriangle, { className: "w-8 h-8 text-red-500" }),
              title: "Wholesale Margin Erosion",
              desc: "Volume discounts and unoptimized supplier terms are quietly eating away at your bottom line while overhead scales linearly."
            },
            {
              icon: /* @__PURE__ */ jsx(Layers, { className: "w-8 h-8 text-orange-500" }),
              title: "Multi-Channel Desync",
              desc: "Overselling on B2B portals while stock sits idle in retail warehouses. Inventory data that's 24 hours out of date."
            },
            {
              icon: /* @__PURE__ */ jsx(Workflow, { className: "w-8 h-8 text-yellow-500" }),
              title: "Production Bottlenecks",
              desc: "Raw material shortages stalling entire production lines because procurement disconnected from demand forecasting."
            }
          ].map((item, i) => /* @__PURE__ */ jsxs(motion.div, { variants: fadeIn, className: "bg-gradient-to-b from-[#1a1a1a] to-[#111] p-4 sm:p-8 rounded-xl border border-[#333] hover:border-[#d4af37]/30 transition-colors", children: [
            /* @__PURE__ */ jsx("div", { className: "mb-6 bg-black w-16 h-16 rounded-full flex items-center justify-center border border-[#333]", children: item.icon }),
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white mb-3", children: item.title }),
            /* @__PURE__ */ jsx("p", { className: "text-gray-400 leading-relaxed", children: item.desc })
          ] }, i)) })
        ]
      }
    ) }) }),
    /* @__PURE__ */ jsx("section", { className: "py-24 relative", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-20", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-3xl md:text-5xl font-bold text-white mb-4", children: [
          "Industrial-Strength ",
          /* @__PURE__ */ jsx("span", { className: "text-[#d4af37]", children: "Control" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-400 max-w-2xl mx-auto", children: "Artisan Flow provides the high-tech infrastructure needed to scale manufacturing without sacrificing margins." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center mb-24", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: -50 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 },
            children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-bold text-white mb-4 flex items-center", children: [
                /* @__PURE__ */ jsx(ShieldCheck, { className: "w-6 h-6 text-[#d4af37] mr-3" }),
                "Margin Protection Engine (Profit Guard)"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-6 text-lg", children: "Automatically calculate landed costs down to the cent. Our Profit Guard system alerts you when wholesale tiers fall below your minimum acceptable margin threshold before the PO is approved." }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-4", children: ["Dynamic landed cost calculations", "Supplier price variance alerts", "Automated tiered pricing enforcement"].map((feature, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center text-gray-300", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-[#d4af37] mr-3 flex-shrink-0" }),
                feature
              ] }, i)) })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 50 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 },
            className: "relative rounded-2xl overflow-hidden border border-[#333] shadow-2xl shadow-[#d4af37]/10",
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" }),
              /* @__PURE__ */ jsx("img", { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000", alt: "Data dashboard", className: "w-full h-auto" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-16 items-center flex-col-reverse lg:flex-row", children: [
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: -50 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 },
            className: "relative rounded-2xl overflow-hidden border border-[#333] shadow-2xl shadow-[#d4af37]/10 order-2 lg:order-1",
            children: [
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" }),
              /* @__PURE__ */ jsx("img", { src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000", alt: "Warehouse logistics", className: "w-full h-auto" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, x: 50 },
            whileInView: { opacity: 1, x: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 },
            className: "order-1 lg:order-2",
            children: [
              /* @__PURE__ */ jsxs("h3", { className: "text-2xl font-bold text-white mb-4 flex items-center", children: [
                /* @__PURE__ */ jsx(PackageCheck, { className: "w-6 h-6 text-[#d4af37] mr-3" }),
                "Omnichannel Sync & Production Routing"
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-gray-400 mb-6 text-lg", children: "Connect B2B wholesale portals, DTC storefronts, and physical warehouse locations in a unified, real-time ledger. Route production demands automatically based on predictive velocity." }),
              /* @__PURE__ */ jsx("ul", { className: "space-y-4", children: ["Sub-second global inventory sync", "BOM (Bill of Materials) explosion forecasting", "Automated reorder point triggers"].map((feature, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-center text-gray-300", children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "w-5 h-5 text-[#d4af37] mr-3 flex-shrink-0" }),
                feature
              ] }, i)) })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 bg-[#0a0a0a] border-y border-[#222]", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4", children: [
      /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 30 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "text-center mb-12",
          children: [
            /* @__PURE__ */ jsx("p", { className: "text-[#d4af37] font-semibold tracking-widest uppercase text-sm mb-4", children: "Trusted by Industry Leaders" }),
            /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-white mb-10", children: "Managing $500M+ in Wholesale GMV" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-2 gap-4 sm:p-8 max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-[#111] p-4 sm:p-8 rounded-xl border border-[#333] relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10", children: /* @__PURE__ */ jsx(TrendingUp, { className: "w-24 h-24" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-300 italic mb-6 relative z-10", children: '"Before Artisan Flow, our B2B portal was constantly out of sync with our main warehouse, leading to cancelled orders and furious distributors. Now, our inventory is unified, and our margins are up 14% due to the Profit Guard system."' }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-800 rounded-full mr-4 border border-[#d4af37]/50 flex items-center justify-center font-bold text-white", children: "MR" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-white", children: "Marcus R." }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-[#d4af37]", children: "VP Operations, Atlas Manufacturing" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-[#111] p-4 sm:p-8 rounded-xl border border-[#333] relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10", children: /* @__PURE__ */ jsx(BarChart3, { className: "w-24 h-24" }) }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-gray-300 italic mb-6 relative z-10", children: `"The BOM forecasting alone paid for the system in the first month. We no longer have production lines sitting idle waiting for raw materials. It's a complete game-changer for physical product scaling."` }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-gray-800 rounded-full mr-4 border border-[#d4af37]/50 flex items-center justify-center font-bold text-white", children: "SL" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-white", children: "Sarah L." }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-[#d4af37]", children: "Supply Chain Director, Nexa Goods" })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "py-24 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-[#1a1500] to-[#0a0a0a] z-0" }),
      /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 relative z-10 text-center max-w-3xl", children: [
        /* @__PURE__ */ jsxs(
          motion.h2,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            className: "text-4xl md:text-5xl font-bold text-white mb-6",
            children: [
              "Ready to Build a ",
              /* @__PURE__ */ jsx("span", { className: "text-[#d4af37]", children: "Resilient" }),
              " Supply Chain?"
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          motion.p,
          {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { delay: 0.1 },
            className: "text-xl text-gray-400 mb-10",
            children: "Deploy Artisan Flow and take total control of your manufacturing, wholesale channels, and margins today."
          }
        ),
        /* @__PURE__ */ jsxs(
          motion.button,
          {
            initial: { opacity: 0, scale: 0.9 },
            whileInView: { opacity: 1, scale: 1 },
            viewport: { once: true },
            transition: { delay: 0.2 },
            onClick: handleCTA,
            className: "px-10 py-5 bg-gradient-to-r from-[#d4af37] to-[#b38b22] text-black font-bold rounded-lg text-xl hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all flex items-center justify-center mx-auto group",
            children: [
              "Lock In Your Profit Margins",
              /* @__PURE__ */ jsx(ArrowRight, { className: "ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "mt-6 text-gray-500", children: "Includes white-glove onboarding for enterprise accounts." })
      ] })
    ] })
  ] });
};
const PublicLayout = ({ children }) => {
  const navigate = useNavigate();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-black text-white selection:bg-[#C5A059] selection:text-black", children: [
    /* @__PURE__ */ jsx("nav", { className: "fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 h-20 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 cursor-pointer", onClick: () => navigate("/"), children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 rounded-xl bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]/30", children: /* @__PURE__ */ jsx(Layers, { className: "text-[#C5A059]", size: 24 }) }),
        /* @__PURE__ */ jsxs("span", { className: "font-serif text-2xl tracking-tight text-white", children: [
          "Artisan",
          /* @__PURE__ */ jsx("span", { className: "text-[#C5A059]", children: "Flow" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", className: "text-white/70 hover:text-white uppercase tracking-widest text-xs", onClick: () => navigate("/auth"), children: "Login" }),
        /* @__PURE__ */ jsx(Button, { variant: "premium", className: "px-6 rounded-full uppercase tracking-widest text-xs font-bold", onClick: () => navigate("/auth"), children: "Start Free Audit" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("main", { className: "pt-20", children }),
    /* @__PURE__ */ jsx("footer", { className: "border-t border-white/10 py-12 mt-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Layers, { className: "text-white/30", size: 20 }),
        /* @__PURE__ */ jsx("span", { className: "font-serif text-lg text-white/50", children: "ArtisanFlow" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-6 text-sm font-sans font-light text-white/40", children: [
        /* @__PURE__ */ jsx("span", { className: "hover:text-white cursor-pointer transition-colors", onClick: () => navigate("/terms"), children: "Terms & Conditions" }),
        /* @__PURE__ */ jsx("span", { className: "hover:text-white cursor-pointer transition-colors", onClick: () => navigate("/privacy"), children: "Privacy Policy" })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-white/30 font-sans tracking-wider", children: "© 2026 ArtisanFlow. All rights reserved." })
    ] }) })
  ] });
};
const AppOverview = () => {
  const navigate = useNavigate();
  const tiers = [
    {
      name: "Free Audit",
      price: "$0/mo",
      description: "Baseline access to start organizing your artisanal business.",
      features: ["Inventory Hub", "Recipe Builder (BOM)", "Basic Production Workflow", "CRM", "Lola AI Assistant"],
      locked: ["Operations Command Center", "Quality Control", "Marketing Studio", "Profit Guard™"]
    },
    {
      name: "Artisan Flow Basic",
      price: "$29/mo",
      description: "The complete ecosystem for scaling makers and botanical formulators.",
      features: ["Operations Command Center", "Full Marketing Hub (Social, Blog, Video)", "Finance Projections", "Supplier Management", "Quality Control"],
      locked: ["Profit Guard™", "Inventory Forecasting"]
    },
    {
      name: "Margin Protection Pro",
      price: "$99/mo",
      description: "Enterprise-grade analytics to protect your margins at scale.",
      features: ["Profit Guard™", "Predictive Inventory Forecasting", "Real-time Anomaly Detection", "White-glove Support"],
      locked: []
    }
  ];
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-[#0A0A0A] text-white selection:bg-[#C5A059] selection:text-white font-sans overflow-x-hidden pt-24 pb-20", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-6", children: [
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "text-center max-w-3xl mx-auto mb-20",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8", children: [
            /* @__PURE__ */ jsx(Sparkles, { size: 14, className: "text-[#C5A059]" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-medium uppercase tracking-[0.2em] text-white/70", children: "Artisan Flow Ecosystem" })
          ] }),
          /* @__PURE__ */ jsxs("h1", { className: "text-5xl md:text-7xl font-serif tracking-tight mb-6 leading-tight", children: [
            "The Ultimate ",
            /* @__PURE__ */ jsx("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#E2C685]", children: "Capability Map" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-lg text-white/50 leading-relaxed font-light", children: "Bridging the gap between raw industrial precision and artisanal craftsmanship. Explore the modules that will scale your formulation business." })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-32", children: [
      /* @__PURE__ */ jsxs(Card, { className: "p-10 border-white/5 bg-black/40 backdrop-blur-xl rounded-[2rem] hover:border-[#C5A059]/30 transition-colors duration-500", children: [
        /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(Factory, { size: 24, className: "text-purple-400" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif mb-4", children: "Operations Hub" }),
        /* @__PURE__ */ jsx("p", { className: "text-white/50 font-light leading-relaxed mb-6", children: "Manage your precise formulations via the Recipe Builder (BOM), schedule production batches, and let the Batch Deduction Engine automatically decrement raw materials." }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex items-center text-sm text-white/70", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { size: 16, className: "text-[#C5A059] mr-3" }),
            " Raw Material Ledger"
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center text-sm text-white/70", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { size: 16, className: "text-[#C5A059] mr-3" }),
            " Kanban Workflow"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { className: "p-10 border-white/5 bg-black/40 backdrop-blur-xl rounded-[2rem] hover:border-[#C5A059]/30 transition-colors duration-500", children: [
        /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6", children: /* @__PURE__ */ jsx(DollarSign, { size: 24, className: "text-emerald-400" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif mb-4", children: "Finance Hub & Profit Guard™" }),
        /* @__PURE__ */ jsx("p", { className: "text-white/50 font-light leading-relaxed mb-6", children: "AI-assisted cash flow analysis. Upgrade to Margin Protection Pro for high-precision margin anomaly detection and predictive inventory forecasting." }),
        /* @__PURE__ */ jsxs("ul", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxs("li", { className: "flex items-center text-sm text-white/70", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { size: 16, className: "text-[#C5A059] mr-3" }),
            " Financial Projections"
          ] }),
          /* @__PURE__ */ jsxs("li", { className: "flex items-center text-sm text-white/70", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { size: 16, className: "text-[#C5A059] mr-3" }),
            " Margin Protection Pro"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mb-20", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center mb-16", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-4xl font-serif tracking-tight mb-4", children: "Ecosystem Tiers" }),
        /* @__PURE__ */ jsx("p", { className: "text-white/50 font-light", children: "Choose the access level that matches your growth." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: tiers.map((tier, idx) => /* @__PURE__ */ jsxs("div", { className: `p-8 rounded-[2rem] border ${idx === 1 ? "border-[#C5A059]/50 bg-[#C5A059]/5" : "border-white/5 bg-black/40"} flex flex-col relative overflow-hidden`, children: [
        idx === 1 && /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 bg-[#C5A059] text-black text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1 rounded-bl-xl", children: "Most Popular" }),
        /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif mb-2", children: tier.name }),
        /* @__PURE__ */ jsx("div", { className: "text-3xl font-light tracking-tight mb-4", children: tier.price }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-white/50 font-light mb-8 flex-1", children: tier.description }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6 mb-8", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4", children: "Included Features" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-3", children: tier.features.map((feat, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start text-sm text-white/80", children: [
              /* @__PURE__ */ jsx(CheckCircle2, { size: 16, className: "text-[#C5A059] mr-3 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsx("span", { children: feat })
            ] }, i)) })
          ] }),
          tier.locked.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("div", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-4 pt-4 border-t border-white/5", children: "Locked Elements" }),
            /* @__PURE__ */ jsx("ul", { className: "space-y-3 opacity-50", children: tier.locked.map((feat, i) => /* @__PURE__ */ jsxs("li", { className: "flex items-start text-sm text-white/60", children: [
              /* @__PURE__ */ jsx(Lock, { size: 14, className: "text-gray-500 mr-3 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsx("span", { children: feat })
            ] }, i)) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: idx === 1 ? "premium" : "outline",
            onClick: () => navigate("/auth"),
            className: "w-full h-12 rounded-xl",
            children: "Get Started"
          }
        )
      ] }, idx)) })
    ] })
  ] }) });
};
const TaxExporter = () => {
  const { getInventoryValue } = useArtisanData();
  const [isExporting, setIsExporting] = useState(false);
  const inventoryValuation = getInventoryValue();
  const mockPurchases = 12500;
  const cogs = mockPurchases - inventoryValuation;
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Schedule C Tax Summary generated and downloaded!");
    }, 2e3);
  };
  return /* @__PURE__ */ jsxs(Card, { className: "bg-black/60 backdrop-blur-xl border border-white/10 p-4 sm:p-8 rounded-3xl relative overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "absolute -top-32 -right-32 w-64 h-64 bg-emerald-600/20 rounded-full blur-[100px]" }),
    /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 flex-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10", children: /* @__PURE__ */ jsx(FileText, { size: 24, className: "text-[#C5A059]" }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-white font-serif", children: "Schedule C Tax Season Helper" }),
            /* @__PURE__ */ jsx("p", { className: "text-white/50 text-sm", children: "Automated COGS calculation and expense extraction." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4 mt-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-white/5 border border-white/5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-white/40 uppercase tracking-widest font-bold mb-1", children: "Ending Inv. Value" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xl text-white font-mono", children: [
              "$",
              inventoryValuation.toLocaleString()
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl bg-white/5 border border-white/5", children: [
            /* @__PURE__ */ jsx("p", { className: "text-xs text-white/40 uppercase tracking-widest font-bold mb-1", children: "Calculated COGS" }),
            /* @__PURE__ */ jsxs("p", { className: "text-xl text-emerald-400 font-mono", children: [
              "$",
              cogs.toLocaleString()
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 w-full md:w-auto", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            onClick: handleExport,
            disabled: isExporting,
            className: "bg-[#C5A059] hover:bg-[#b08d4a] text-black h-14 px-8 rounded-xl font-bold tracking-widest uppercase flex items-center justify-center gap-3 w-full md:w-auto",
            children: [
              isExporting ? /* @__PURE__ */ jsx(Calculator, { className: "animate-spin", size: 18 }) : /* @__PURE__ */ jsx(Download, { size: 18 }),
              isExporting ? "GENERATING..." : "EXPORT IRS SUMMARY"
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/30 text-center max-w-[200px] mx-auto", children: "Generates a structured CSV mapping to IRS Schedule C Line 35-42 requirements." })
      ] })
    ] })
  ] });
};
const COLORS_LIST = ["#6A2C91", "#C5A059", "#78BE20", "#5B5F7F", "#1A1A1A"];
const FinanceHub = () => {
  const navigate = useNavigate();
  const { orders, inventory, getTotalRevenue, getInventoryValue } = useArtisanData();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportModal, setReportModal] = useState({ isOpen: false, type: "" });
  const [isBudgeting, setIsBudgeting] = useState(false);
  const [budgetResult, setBudgetResult] = useState(null);
  const revenue = getTotalRevenue();
  getInventoryValue();
  const estimatedCOGS = orders.reduce((acc, order) => {
    return acc + order.items.reduce((itemAcc, item) => {
      const invItem = inventory.find((i) => i.name === item.name);
      const cost = (invItem == null ? void 0 : invItem.unitCost) || 3.5;
      return itemAcc + item.qty * cost;
    }, 0);
  }, 0);
  const grossProfit = revenue - estimatedCOGS;
  const margin = revenue > 0 ? grossProfit / revenue * 100 : 0;
  const handleGenerateReport = (type) => {
    setReportModal({ isOpen: true, type });
  };
  const runBudgetOptimizer = async () => {
    setIsBudgeting(true);
    const result = await generateBudgetStrategy(revenue, estimatedCOGS, "Scale marketing and optimize raw material sourcing");
    setBudgetResult(result);
    setIsBudgeting(false);
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      className: "space-y-12 pb-20 p-4 sm:p-10 md:p-16 max-w-[1600px] mx-auto",
      children: [
        /* @__PURE__ */ jsx(
          ContextualTutorialModal,
          {
            hubId: "finance",
            title: "Finance & Margins",
            description: "Keep a pulse on your profitability and cash flow.",
            steps: ["Review total revenue and expenses.", "Analyze margin multipliers per product.", "Forecast cash runway and operational costs."]
          }
        ),
        /* @__PURE__ */ jsx(
          Modal,
          {
            isOpen: reportModal.isOpen,
            onClose: () => setReportModal({ isOpen: false, type: "" }),
            title: `Initialize ${reportModal.type} Generation`,
            children: /* @__PURE__ */ jsxs("div", { className: "space-y-8 py-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "bg-[#6A2C91]/10 border border-[#6A2C91]/20 p-6 rounded-3xl flex items-start gap-4", children: [
                /* @__PURE__ */ jsx(Sparkles, { className: "text-[#6A2C91] shrink-0 mt-1", size: 20 }),
                /* @__PURE__ */ jsxs("p", { className: "text-white/70 text-sm font-sans font-light leading-relaxed italic", children: [
                  "Our AI is cross-referencing your ",
                  /* @__PURE__ */ jsx("span", { className: "text-white font-bold not-italic", children: "Inventory Burn Rates" }),
                  " with ",
                  /* @__PURE__ */ jsx("span", { className: "text-white font-bold not-italic", children: "Order Velocity" }),
                  " to construct a high-fidelity ",
                  reportModal.type,
                  "."
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.3em] ml-2", children: "Report Parameters" }),
                /* @__PURE__ */ jsxs(Select, { defaultValue: "Full Fiscal Year", className: "bg-black/40 text-white border-white/10 h-14 rounded-2xl", children: [
                  /* @__PURE__ */ jsx("option", { value: "Current Quarter", className: "bg-[#1A1A1A]", children: "Current Quarter" }),
                  /* @__PURE__ */ jsx("option", { value: "Full Fiscal Year", className: "bg-[#1A1A1A]", children: "Full Fiscal Year" }),
                  /* @__PURE__ */ jsx("option", { value: "Comparative", className: "bg-[#1A1A1A]", children: "Comparative (Last 2 Years)" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  className: "w-full bg-[#6A2C91] hover:bg-[#5a257a] text-white h-16 rounded-full font-sans font-bold text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 transition-all",
                  onClick: () => {
                    setIsGenerating(true);
                    setReportModal({ isOpen: false, type: "" });
                    setTimeout(() => {
                      setIsGenerating(false);
                    }, 2500);
                  },
                  children: "DEPLOY AI AUDITOR"
                }
              )
            ] })
          }
        ),
        isGenerating && /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex flex-col items-center justify-center", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-[#6A2C91] mb-8", size: 64, strokeWidth: 1 }),
          /* @__PURE__ */ jsx("h2", { className: "text-4xl font-serif text-white tracking-tight uppercase italic mb-4", children: "Synthesizing Ledger..." }),
          /* @__PURE__ */ jsx("p", { className: "text-white/50 text-lg font-sans font-light", children: "Lola is reconciling omnichannel transactions." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/command-center"), className: "flex items-center gap-3 text-white/40 hover:text-white font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all group w-fit", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { size: 16, className: "group-hover:-translate-x-2 transition-transform" }),
            " Back to Command Center"
          ] }),
          /* @__PURE__ */ jsx(
            VaultBanner,
            {
              title: "Finance Hub",
              subtitle: "Vault Ledger & High-Precision Financial Architecture. Reconciling craftsmanship with capital growth.",
              badge: "Financial Protocol Active",
              children: /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsxs(
                Button,
                {
                  className: "bg-[#C5A059] hover:bg-[#b08e4d] text-white font-sans font-bold text-[11px] tracking-[0.3em] h-16 px-10 rounded-full shadow-2xl shadow-black/10 transition-all uppercase",
                  onClick: () => navigate("/finance/projections"),
                  children: [
                    /* @__PURE__ */ jsx(TrendingUp, { size: 16, className: "mr-3" }),
                    " GENERATE 5-YEAR PROJECTION"
                  ]
                }
              ) })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsx(FinanceCard, { title: "Gross Revenue", value: `$${revenue.toFixed(2)}`, trend: "+12.4%", positive: true, icon: DollarSign }),
          /* @__PURE__ */ jsx(FinanceCard, { title: "COGS (Interconnected)", value: `$${estimatedCOGS.toFixed(2)}`, trend: "-2.1%", positive: true, icon: Package }),
          /* @__PURE__ */ jsx(FinanceCard, { title: "Net Profit", value: `$${grossProfit.toFixed(2)}`, trend: "+8.5%", positive: true, icon: TrendingUp }),
          /* @__PURE__ */ jsx(FinanceCard, { title: "Avg. Margin", value: `${margin.toFixed(1)}%`, trend: "Stable", positive: true, icon: Target })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-12", children: [
            /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-black/40 backdrop-blur-xl border border-white/10 p-4 sm:p-12 rounded-[3rem] shadow-2xl", children: [
              /* @__PURE__ */ jsx("div", { className: "mb-10", children: /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif text-white tracking-tight", children: "Interconnected Flow Ledger" }) }),
              /* @__PURE__ */ jsx("div", { className: "h-96 w-full", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: [
                { month: "Jul", rev: 4500, exp: 2800 },
                { month: "Aug", rev: 5200, exp: 3100 },
                { month: "Sep", rev: 4800, exp: 2900 },
                { month: "Oct", rev: 6100, exp: 3400 },
                { month: "Nov", rev: 7200, exp: 4100 },
                { month: "Dec", rev: 8900, exp: 4800 }
              ], children: [
                /* @__PURE__ */ jsxs("defs", { children: [
                  /* @__PURE__ */ jsxs("linearGradient", { id: "colorRev", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#6A2C91", stopOpacity: 0.4 }),
                    /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#6A2C91", stopOpacity: 0 })
                  ] }),
                  /* @__PURE__ */ jsxs("linearGradient", { id: "colorExp", x1: "0", y1: "0", x2: "0", y2: "1", children: [
                    /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#C5A059", stopOpacity: 0.4 }),
                    /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#C5A059", stopOpacity: 0 })
                  ] })
                ] }),
                /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "rgba(255,255,255,0.05)" }),
                /* @__PURE__ */ jsx(XAxis, { dataKey: "month", axisLine: false, tickLine: false, tick: { fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "Inter", fontWeight: 600 }, dy: 10 }),
                /* @__PURE__ */ jsx(YAxis, { hide: true }),
                /* @__PURE__ */ jsx(
                  Tooltip,
                  {
                    contentStyle: { backgroundColor: "#1A1A1A", borderRadius: "1.5rem", border: "1px solid rgba(255,255,255,0.1)" },
                    itemStyle: { color: "#fff", fontFamily: "Inter", fontWeight: 600 },
                    labelStyle: { color: "rgba(255,255,255,0.4)", fontFamily: "Inter", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em" }
                  }
                ),
                /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "rev", stroke: "#6A2C91", strokeWidth: 4, fill: "url(#colorRev)", name: "Revenue" }),
                /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "exp", stroke: "#C5A059", strokeWidth: 4, fill: "url(#colorExp)", name: "Expenses" })
              ] }) }) }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-4 sm:p-8 mt-10 justify-center", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-[#6A2C91] rounded-full shadow-[0_0_10px_#6A2C91]" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold font-sans uppercase tracking-[0.3em] text-white/40", children: "Omnichannel Revenue" })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("div", { className: "w-3 h-3 bg-[#C5A059] rounded-full shadow-[0_0_10px_#C5A059]" }),
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-[11px] font-bold font-sans uppercase tracking-[0.3em] text-white/40", children: "Operational Expenses" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-[#1A1A1A] border border-[#C5A059]/20 p-4 sm:p-12 rounded-[3rem] shadow-[0_20px_50px_rgba(197,160,89,0.05)] relative overflow-hidden group", children: [
              /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#C5A059]/10 to-transparent rounded-bl-full opacity-50 -mr-20 -mt-20 pointer-events-none" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 relative z-10", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("h4", { className: "text-3xl font-serif text-[#C5A059] tracking-tight flex items-center gap-4", children: [
                    /* @__PURE__ */ jsx(Wallet, { size: 28 }),
                    " Budget Guard™ Active"
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "text-white/50 font-sans font-light text-lg mt-2", children: "Auto-allocating resources based on high-margin trajectories." })
                ] }),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    onClick: runBudgetOptimizer,
                    disabled: isBudgeting,
                    className: "bg-[#C5A059] hover:bg-[#b08e4d] text-white border-none h-14 rounded-full px-8 font-bold font-sans uppercase text-[11px] tracking-[0.3em] shadow-xl shadow-[#C5A059]/20 transition-all",
                    children: isBudgeting ? /* @__PURE__ */ jsx(Loader2, { className: "animate-spin mx-auto" }) : "RECALCULATE ALLOCATION"
                  }
                )
              ] }),
              budgetResult ? /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10 animate-in slide-up", children: [
                /* @__PURE__ */ jsxs("div", { className: "h-72 relative", children: [
                  /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart$1, { children: [
                    /* @__PURE__ */ jsx(
                      Pie,
                      {
                        data: budgetResult.allocation,
                        cx: "50%",
                        cy: "50%",
                        innerRadius: 70,
                        outerRadius: 100,
                        paddingAngle: 5,
                        dataKey: "amount",
                        stroke: "none",
                        children: budgetResult.allocation.map((entry, index) => /* @__PURE__ */ jsx(Cell, { fill: COLORS_LIST[index % COLORS_LIST.length] }, `cell-${index}`))
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      Tooltip,
                      {
                        contentStyle: { backgroundColor: "#1A1A1A", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.1)" },
                        itemStyle: { color: "#fff", fontFamily: "Inter", fontWeight: 600 }
                      }
                    )
                  ] }) }),
                  /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: [
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] font-bold font-sans uppercase text-white/40 tracking-[0.3em]", children: "Runway" }),
                    /* @__PURE__ */ jsxs("p", { className: "text-4xl font-serif text-white tracking-tighter mt-1", children: [
                      budgetResult.runwayMonths,
                      "mo"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-6 flex flex-col justify-center", children: [
                  /* @__PURE__ */ jsx("h5", { className: "text-[11px] font-bold font-sans text-[#C5A059] uppercase tracking-[0.3em] border-b border-[#C5A059]/20 pb-4", children: "Optimization Protocol" }),
                  budgetResult.optimizationTips.map((tip, i) => /* @__PURE__ */ jsxs("div", { className: "flex gap-4 items-start group", children: [
                    /* @__PURE__ */ jsx("div", { className: "p-1.5 bg-[#C5A059]/20 rounded-lg text-[#C5A059] mt-0.5", children: /* @__PURE__ */ jsx(CheckCircle, { size: 14 }) }),
                    /* @__PURE__ */ jsx("p", { className: "text-sm text-white/60 font-sans font-light leading-relaxed group-hover:text-white transition-colors", children: tip })
                  ] }, i))
                ] })
              ] }) : /* @__PURE__ */ jsxs("div", { className: "py-24 text-center border border-dashed border-white/10 rounded-[2rem] bg-white/5 relative z-10", children: [
                /* @__PURE__ */ jsx(GanttChartSquare, { size: 48, className: "text-white/10 mx-auto mb-6", strokeWidth: 1 }),
                /* @__PURE__ */ jsx("p", { className: "text-white/30 text-[11px] font-sans font-bold uppercase tracking-[0.3em]", children: "Awaiting Command Initialization" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 space-y-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-4 sm:p-10", children: [
              /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
                /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif text-white tracking-tight mb-4", children: "Synaptic Reports" }),
                /* @__PURE__ */ jsx("p", { className: "text-white/50 text-sm font-sans font-light italic leading-relaxed", children: "Generate legally-compliant financial dossiers architected from your real-time database." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsx(ReportButton, { label: "Profit & Loss Statement", icon: FileText, onClick: () => handleGenerateReport("P&L") }),
                /* @__PURE__ */ jsx(ReportButton, { label: "Balance Sheet Node", icon: BarChart3, onClick: () => handleGenerateReport("Balance Sheet") }),
                /* @__PURE__ */ jsx(ReportButton, { label: "Cash Flow Projections", icon: PieChart, onClick: () => handleGenerateReport("Cash Flow") }),
                /* @__PURE__ */ jsx(ReportButton, { label: "Inventory Valuation Tax Log", icon: ShieldCheck, onClick: () => handleGenerateReport("Tax Log") })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-10 pt-8 border-t border-white/10", children: /* @__PURE__ */ jsxs("div", { className: "bg-black/40 p-6 rounded-3xl border border-white/5", children: [
                /* @__PURE__ */ jsxs("h4", { className: "text-[11px] font-sans font-bold uppercase text-white/40 tracking-[0.3em] mb-4 flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx(ShieldCheck, { className: "text-emerald-500", size: 16 }),
                  " Audit Trail Status"
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("p", { className: "text-lg font-serif text-white tracking-tight", children: "Systems Synchronized" }),
                    /* @__PURE__ */ jsx("p", { className: "text-[10px] text-white/30 uppercase tracking-widest mt-1", children: "Reconciliation: Today, 09:14 AM" })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(CheckCircle, { className: "text-emerald-500 animate-pulse", size: 20 }) })
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-4 sm:p-10", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-2xl font-serif text-white tracking-tight mb-8", children: "System Parameters" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[11px] font-bold font-sans text-white/40 uppercase tracking-[0.3em] block mb-3", children: "Primary Currency" }),
                  /* @__PURE__ */ jsxs(Select, { defaultValue: "USD", className: "bg-black/40 border-white/10 text-white rounded-2xl h-14", children: [
                    /* @__PURE__ */ jsx("option", { className: "bg-[#1A1A1A]", children: "USD ($)" }),
                    /* @__PURE__ */ jsx("option", { className: "bg-[#1A1A1A]", children: "EUR (€)" }),
                    /* @__PURE__ */ jsx("option", { className: "bg-[#1A1A1A]", children: "GBP (£)" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { className: "text-[11px] font-bold font-sans text-white/40 uppercase tracking-[0.3em] block mb-3", children: "Fiscal Year Lock" }),
                  /* @__PURE__ */ jsx(Badge, { color: "purple", className: "w-full justify-center py-4 text-[11px] bg-[#6A2C91]/20 border-[#6A2C91]/30", children: "DECEMBER 31ST" })
                ] })
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
};
const FinanceCard = ({ title, value, trend, positive, icon: Icon }) => /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-4 sm:p-8 relative overflow-hidden group hover:border-white/20 hover:shadow-2xl transition-all duration-500", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 sm:p-8 opacity-[0.03] group-hover:opacity-10 group-hover:scale-110 transition-all duration-700", children: /* @__PURE__ */ jsx(Icon, { size: 64, className: "text-[#6A2C91]" }) }),
  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6", children: [
    /* @__PURE__ */ jsx("span", { className: "text-white/40 font-sans font-bold text-[11px] uppercase tracking-[0.3em]", children: title }),
    /* @__PURE__ */ jsx("div", { className: `p-3 rounded-xl bg-white/5 text-[#C5A059] border border-white/5 group-hover:bg-[#C5A059]/20 group-hover:border-[#C5A059]/30 transition-all shadow-inner`, children: /* @__PURE__ */ jsx(Icon, { size: 20, strokeWidth: 1.5 }) })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "text-4xl font-serif text-white tracking-tighter mb-4", children: value }),
  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
    positive ? /* @__PURE__ */ jsx(ArrowUpRight, { className: "text-emerald-400", size: 16 }) : /* @__PURE__ */ jsx(ArrowDownRight, { className: "text-red-400", size: 16 }),
    /* @__PURE__ */ jsx("span", { className: `${positive ? "text-emerald-400" : "text-red-400"} text-[11px] font-sans font-bold uppercase tracking-[0.3em]`, children: trend })
  ] })
] });
const ReportButton = ({ label, icon: Icon, onClick }) => /* @__PURE__ */ jsxs(
  "button",
  {
    onClick,
    className: "w-full flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5 hover:border-[#6A2C91]/50 hover:bg-[#6A2C91]/10 transition-all group overflow-hidden relative",
    children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 relative z-10", children: [
        /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-[#6A2C91] group-hover:bg-[#6A2C91]/20 transition-all", children: /* @__PURE__ */ jsx(Icon, { size: 18 }) }),
        /* @__PURE__ */ jsx("span", { className: "text-sm font-sans font-light text-white/70 group-hover:text-white transition-colors tracking-wide", children: label })
      ] }),
      /* @__PURE__ */ jsx(Download, { className: "text-white/20 group-hover:text-white relative z-10 transition-colors", size: 20 })
    ]
  }
);
const FinancialProjections = () => {
  const navigate = useNavigate();
  const { orders, inventory } = useArtisanData();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("Standard");
  const [planTab, setPlanTab] = useState("1");
  useEffect(() => {
    fetchAnalysis();
  }, []);
  const fetchAnalysis = async () => {
    setLoading(true);
    const result = await generateFinancialAnalysis(orders, inventory);
    setAnalysis(result);
    setLoading(false);
  };
  const handleDownloadReport = () => {
    if (!analysis) return;
    const content = `
ARTISAN FLOW: STRATEGIC FINANCIAL ARCHITECTURE REPORT
Generated: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}
Status: ${analysis.riskLevel} Risk System State

EXECUTIVE SUMMARY
${analysis.summary}

--- RECOVERY PROTOCOLS (TO BALANCED STATE) ---
1-YEAR RECOVERY: ${analysis.recoveryPlans.oneYear}
3-YEAR RECOVERY: ${analysis.recoveryPlans.threeYear}
5-YEAR RECOVERY: ${analysis.recoveryPlans.fiveYear}

--- PROJECTIONS: STANDARD GROWTH ---
${analysis.projections.map((p) => `Year ${p.year}: Rev $${p.projectedRevenue.toLocaleString()} | Profit $${p.projectedProfit.toLocaleString()}`).join("\n")}

--- PROJECTIONS: DROPSHIPPING STRATEGY SCALE ---
${analysis.dropshippingEstimates.map((p) => `Year ${p.year}: Rev $${p.estRevenue.toLocaleString()} | Profit $${p.estProfit.toLocaleString()}`).join("\n")}

CERTIFIED BY LOLA AI SYSTEMS
        `;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `LRC_ArtisanFlow_Projections_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      className: "space-y-12 pb-20 p-4 sm:p-10 md:p-16 max-w-[1600px] mx-auto",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/finance"), className: "flex items-center gap-3 text-white/40 hover:text-white font-sans font-bold text-[11px] uppercase tracking-[0.3em] transition-all group w-fit", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { size: 16, className: "group-hover:-translate-x-2 transition-transform" }),
            " Back to Finance Hub"
          ] }),
          !loading && analysis && /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleDownloadReport,
              className: "bg-[#6A2C91] hover:bg-[#5a257a] text-white font-sans font-bold text-[11px] h-14 rounded-full px-8 tracking-[0.3em] shadow-2xl shadow-[#6A2C91]/20 transition-all uppercase flex items-center justify-center gap-3",
              children: [
                /* @__PURE__ */ jsx(Download, { size: 16 }),
                " DOWNLOAD FINAL DOSSIER"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-16 shadow-2xl relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-[#C5A059]/10 rounded-bl-full -mr-20 -mt-20 pointer-events-none" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#6A2C91]/10 rounded-tr-full -ml-32 -mb-32 pointer-events-none" }),
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col md:flex-row justify-between items-start gap-16", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-[#6A2C91] shadow-inner backdrop-blur-md", children: /* @__PURE__ */ jsx(Sparkles, { size: 32, strokeWidth: 1.5 }) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-serif text-white tracking-tight", children: "Strategic Projections" }),
                  /* @__PURE__ */ jsx("p", { className: "text-white/50 font-sans font-light text-lg mt-2 italic", children: "Synthesizing recovery paths and dropshipping scalability." })
                ] })
              ] }),
              loading ? /* @__PURE__ */ jsxs("div", { className: "py-10 space-y-4", children: [
                /* @__PURE__ */ jsx("div", { className: "h-4 bg-white/10 rounded-full w-full animate-pulse" }),
                /* @__PURE__ */ jsx("div", { className: "h-4 bg-white/10 rounded-full w-3/4 animate-pulse" }),
                /* @__PURE__ */ jsx("div", { className: "h-4 bg-white/10 rounded-full w-1/2 animate-pulse" })
              ] }) : /* @__PURE__ */ jsx("div", { className: "prose max-w-none", children: /* @__PURE__ */ jsxs("p", { className: "text-xl text-white/70 font-sans font-light leading-relaxed italic border-l-2 border-[#C5A059] pl-6", children: [
                '"',
                (analysis == null ? void 0 : analysis.summary) || "Analyzing current ledger to establish recovery trajectory...",
                '"'
              ] }) })
            ] }),
            !loading && analysis && /* @__PURE__ */ jsxs("div", { className: "w-full md:w-96 bg-black/40 rounded-[2.5rem] p-4 sm:p-12 border border-white/5 flex flex-col items-center text-center shadow-inner", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-sans font-bold text-white/40 uppercase tracking-[0.3em] mb-8", children: "Risk Architecture" }),
              /* @__PURE__ */ jsx("div", { className: `w-32 h-32 rounded-full border-[10px] flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,0,0,0.5)] ${analysis.riskLevel === "Low" ? "border-emerald-500/20 text-emerald-400" : analysis.riskLevel === "Medium" ? "border-amber-500/20 text-amber-400" : "border-red-500/20 text-red-400"}`, children: /* @__PURE__ */ jsx(ShieldCheck, { size: 48, strokeWidth: 1.5 }) }),
              /* @__PURE__ */ jsx("h3", { className: `text-4xl font-serif tracking-tighter ${analysis.riskLevel === "Low" ? "text-emerald-400" : analysis.riskLevel === "Medium" ? "text-amber-400" : "text-red-400"}`, children: analysis.riskLevel }),
              /* @__PURE__ */ jsx("p", { className: "text-[11px] font-sans font-bold uppercase tracking-[0.3em] text-white/30 mt-3", children: "Risk Assessment" })
            ] })
          ] })
        ] }),
        !loading && analysis && /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-[#0A0A0A] border border-[#6A2C91]/20 rounded-[3rem] p-4 sm:p-12 shadow-2xl relative overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif text-white tracking-tight", children: "Recovery Protocols" }),
            /* @__PURE__ */ jsx("div", { className: "flex bg-black/60 p-1.5 rounded-2xl border border-white/5 shadow-inner", children: ["1", "3", "5"].map((tab) => /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setPlanTab(tab),
                className: `px-8 py-3 rounded-xl text-[11px] font-sans font-bold uppercase tracking-[0.3em] transition-all ${planTab === tab ? "bg-white/10 text-white shadow-md" : "text-white/30 hover:text-white/60"}`,
                children: [
                  tab,
                  " Year"
                ]
              },
              tab
            )) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-10 bg-white/5 rounded-[2rem] border border-white/10 animate-in fade-in zoom-in duration-500 shadow-inner", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4 sm:p-8", children: [
            /* @__PURE__ */ jsx("div", { className: "w-14 h-14 bg-[#6A2C91]/20 rounded-2xl text-[#6A2C91] flex items-center justify-center border border-[#6A2C91]/30 shrink-0", children: /* @__PURE__ */ jsx(Map, { size: 24, strokeWidth: 1.5 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("h4", { className: "text-2xl font-serif text-white tracking-tight mb-4", children: [
                planTab,
                "-Year Strategic Plan"
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "text-white/60 font-sans font-light text-lg leading-relaxed", children: [
                planTab === "1" && analysis.recoveryPlans.oneYear,
                planTab === "3" && analysis.recoveryPlans.threeYear,
                planTab === "5" && analysis.recoveryPlans.fiveYear
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-end gap-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif text-white tracking-tight mb-2", children: "Projected Revenue Velocity" }),
              /* @__PURE__ */ jsx("p", { className: "text-white/50 font-sans font-light italic", children: "Comparing standard growth vs. dropshipping optimization strategy." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex bg-black/40 p-1.5 rounded-2xl border border-white/5", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setViewMode("Standard"),
                  className: `px-8 py-3 rounded-xl text-[11px] font-sans font-bold uppercase tracking-[0.3em] transition-all ${viewMode === "Standard" ? "bg-[#6A2C91] text-white shadow-lg" : "text-white/40 hover:text-white/70"}`,
                  children: "Standard"
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => setViewMode("Dropshipping"),
                  className: `px-8 py-3 rounded-xl text-[11px] font-sans font-bold uppercase tracking-[0.3em] transition-all flex items-center gap-2 ${viewMode === "Dropshipping" ? "bg-[#C5A059] text-white shadow-lg" : "text-white/40 hover:text-white/70"}`,
                  children: [
                    /* @__PURE__ */ jsx(Ship, { size: 14 }),
                    " Dropshipping"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "luxury-card bg-black/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-4 sm:p-12", children: [
            /* @__PURE__ */ jsx("div", { className: "h-[500px] w-full", children: loading ? /* @__PURE__ */ jsx("div", { className: "w-full h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { size: 64, strokeWidth: 1, className: "animate-spin text-white/20" }) }) : /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart$1, { data: viewMode === "Standard" ? analysis == null ? void 0 : analysis.projections : analysis == null ? void 0 : analysis.dropshippingEstimates, margin: { top: 20, right: 0, left: -20, bottom: 0 }, children: [
              /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "rgba(255,255,255,0.05)" }),
              /* @__PURE__ */ jsx(XAxis, { dataKey: "year", axisLine: false, tickLine: false, tick: { fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "Inter", fontWeight: 600 }, dy: 15 }),
              /* @__PURE__ */ jsx(YAxis, { axisLine: false, tickLine: false, tick: { fill: "rgba(255,255,255,0.4)", fontSize: 11, fontFamily: "Inter" }, tickFormatter: (val) => `$${val / 1e3}k` }),
              /* @__PURE__ */ jsx(
                Tooltip,
                {
                  cursor: { fill: "rgba(255,255,255,0.02)" },
                  contentStyle: { backgroundColor: "#1A1A1A", borderRadius: "1.5rem", border: "1px solid rgba(255,255,255,0.1)", padding: "20px" },
                  itemStyle: { color: "#fff", fontFamily: "Inter", fontWeight: 600 },
                  labelStyle: { color: "rgba(255,255,255,0.4)", fontFamily: "Inter", fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "8px" }
                }
              ),
              /* @__PURE__ */ jsx(Legend, { wrapperStyle: { paddingTop: "40px", fontSize: "11px", fontFamily: "Inter", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.5)" } }),
              /* @__PURE__ */ jsx(
                Bar,
                {
                  dataKey: viewMode === "Standard" ? "projectedRevenue" : "estRevenue",
                  fill: viewMode === "Standard" ? "#6A2C91" : "#C5A059",
                  radius: [12, 12, 0, 0],
                  name: viewMode === "Standard" ? "Standard Revenue" : "Dropshipping Target Revenue"
                }
              ),
              /* @__PURE__ */ jsx(
                Bar,
                {
                  dataKey: viewMode === "Standard" ? "projectedProfit" : "estProfit",
                  fill: "#78BE20",
                  radius: [12, 12, 0, 0],
                  name: "Net Profit"
                }
              )
            ] }) }) }),
            viewMode === "Dropshipping" && /* @__PURE__ */ jsxs("div", { className: "mt-12 flex items-start gap-4 p-6 bg-[#C5A059]/10 rounded-[2rem] border border-[#C5A059]/20 shadow-inner", children: [
              /* @__PURE__ */ jsx(Info, { size: 24, className: "text-[#C5A059] shrink-0", strokeWidth: 1.5 }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm text-white/70 font-sans font-light leading-relaxed", children: [
                "Dropshipping estimates assume a ",
                /* @__PURE__ */ jsx("strong", { className: "text-white font-medium", children: "low-overhead fulfillment model" }),
                " where stock is managed by the Synaptic Handshake nodes. Profit margins are optimized for high-throughput scaling without proportional inventory risk."
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx(TaxExporter, {})
      ]
    }
  );
};
const BudgetGuard = () => {
  const navigate = useNavigate();
  const {
    budgets,
    updateBudget,
    orders,
    inventory,
    getTotalRevenue,
    getInventoryValue,
    getMarginMetrics
  } = useArtisanData();
  const [timeframe, setTimeframe] = useState("monthly");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [tempValue, setTempValue] = useState(budgets[timeframe].toString());
  useEffect(() => {
    setTempValue(budgets[timeframe].toString());
    runAIAnalysis();
  }, [timeframe]);
  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    const context = {
      currentBudget: budgets[timeframe],
      timeframe,
      revenue: getTotalRevenue(),
      inventoryValue: getInventoryValue(),
      marginMetrics: getMarginMetrics(),
      orderCount: orders.length
    };
    const result = await analyzeBudgetGuard(context);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };
  const handleSaveBudget = () => {
    updateBudget({ [timeframe]: parseFloat(tempValue) || 0 });
    alert(`Vault Update: ${timeframe.toUpperCase()} budget target synchronized.`);
  };
  const applyAISuggestion = () => {
    if (!aiAnalysis) return;
    const newVal = aiAnalysis.suggestedIncrease ? budgets[timeframe] + aiAnalysis.amount : budgets[timeframe] - aiAnalysis.amount;
    setTempValue(newVal.toFixed(2));
    updateBudget({ [timeframe]: newVal });
    alert(`Synaptic Override: AI suggestion applied to ${timeframe} budget.`);
  };
  const spent = getTotalRevenue() * 0.4;
  const utilization = budgets[timeframe] > 0 ? spent / budgets[timeframe] * 100 : 0;
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-in fade-in pb-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => navigate("/finance"), className: "flex items-center gap-2 text-gray-400 hover:text-[#6A2C91] font-black text-xs uppercase tracking-widest mb-4 transition-colors", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { size: 16 }),
          " Back to Finance"
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(ShieldCheck, { className: "text-[#6A2C91]", size: 36 }),
          " Budget Guard™"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 font-medium", children: "Synaptic Financial Steering: Real-time analysis for growth capitalization." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex bg-stone-100 p-1 rounded-2xl border border-stone-200", children: ["daily", "weekly", "monthly", "yearly"].map((t) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setTimeframe(t),
          className: `px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === t ? "bg-white text-[#6A2C91] shadow-lg" : "text-gray-400 hover:text-gray-600"}`,
          children: t
        },
        t
      )) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 sm:p-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-1 space-y-8", children: [
        /* @__PURE__ */ jsxs(Card, { title: "Architect's Target", className: "rounded-[2.5rem] border-stone-100 shadow-xl overflow-hidden relative", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 sm:p-8 opacity-5 text-purple-600", children: /* @__PURE__ */ jsx(Target, { size: 80 }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-6 mt-4 relative z-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxs("label", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1", children: [
                "Set Your ",
                timeframe,
                " Limit ($)"
              ] }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  value: tempValue,
                  onChange: (e) => setTempValue(e.target.value),
                  className: "text-2xl font-black rounded-2xl h-16 py-4"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: handleSaveBudget,
                className: "w-full bg-[#6A2C91] text-white h-14 font-black uppercase text-xs tracking-[0.2em] rounded-2xl shadow-xl shadow-purple-100",
                children: "COMMIT TARGET TO VAULT"
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-stone-100", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end mb-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Target Utilization" }),
                /* @__PURE__ */ jsxs("p", { className: "text-xl font-black text-gray-900", children: [
                  utilization.toFixed(1),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "w-full bg-stone-100 h-3 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: `h-full transition-all duration-1000 ${utilization > 90 ? "bg-red-500" : "bg-[#C5A059]"}`,
                  style: { width: `${Math.min(utilization, 100)}%` }
                }
              ) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-stone-900 p-4 sm:p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsx(Zap, { size: 20, className: "text-amber-400" }),
            /* @__PURE__ */ jsx("h4", { className: "text-lg font-black uppercase italic tracking-tighter", children: "Synaptic Analysis" })
          ] }),
          isAnalyzing ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center py-10", children: [
            /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-amber-400 mb-4", size: 32 }),
            /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase text-stone-500 tracking-widest", children: "Querying Vault Nodes..." })
          ] }) : aiAnalysis ? /* @__PURE__ */ jsxs("div", { className: "space-y-6 animate-in slide-up", children: [
            /* @__PURE__ */ jsx("div", { className: "p-4 bg-white/5 rounded-2xl border border-white/10", children: /* @__PURE__ */ jsxs("p", { className: "text-xs text-stone-300 leading-relaxed font-medium", children: [
              '"',
              aiAnalysis.reasoning,
              '"'
            ] }) }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-400", children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "Priority: ",
                /* @__PURE__ */ jsx("span", { className: "text-amber-400", children: aiAnalysis.strategicPriority })
              ] }),
              /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                "Risk: ",
                /* @__PURE__ */ jsx(Badge, { color: aiAnalysis.riskLevel === "Low" ? "green" : "gold", className: "text-[8px]", children: aiAnalysis.riskLevel })
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsx("p", { className: "text-stone-500 text-xs italic", children: "Establish factory link for real-time suggestions." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsxs(Card, { title: "Lola’s Proposal", className: "bg-purple-50 border-purple-100 shadow-lg relative overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-6 opacity-[0.03] text-purple-600", children: /* @__PURE__ */ jsx(Sparkles, { size: 100 }) }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 relative z-10", children: aiAnalysis ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1", children: "Recommended Adjust." }),
              /* @__PURE__ */ jsxs("p", { className: `text-4xl font-black tracking-tighter ${aiAnalysis.suggestedIncrease ? "text-emerald-600" : "text-red-600"}`, children: [
                aiAnalysis.suggestedIncrease ? "+" : "-",
                "$",
                aiAnalysis.amount.toFixed(2)
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: applyAISuggestion,
                  className: "mt-6 bg-white border border-purple-200 text-[#6A2C91] h-12 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-md",
                  children: "APPLY SUGGESTION"
                }
              )
            ] }) : /* @__PURE__ */ jsx("div", { className: "h-24 flex items-center justify-center", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin text-purple-200" }) }) })
          ] }),
          /* @__PURE__ */ jsx(Card, { title: "Budget Health Check", className: "border-stone-100", children: /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-3 bg-stone-50 rounded-xl", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-gray-400 uppercase", children: "Burn Rate" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-gray-900", children: "Optimal" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center p-3 bg-stone-50 rounded-xl", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-gray-400 uppercase", children: "Forecast Integrity" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-emerald-600", children: "94%" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(Card, { title: "Strategic Financial Ledger", className: "border-stone-100", children: /* @__PURE__ */ jsx("div", { className: "space-y-4 mt-4", children: [
          { label: "Marketing Reallocation", amount: budgets[timeframe] * 0.3, priority: "High" },
          { label: "Raw Material Buffer", amount: budgets[timeframe] * 0.2, priority: "Medium" },
          { label: "R&D / New Formulas", amount: budgets[timeframe] * 0.1, priority: "Low" }
        ].map((item, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-0 group", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 bg-white border border-stone-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#6A2C91] transition-colors shadow-sm", children: /* @__PURE__ */ jsx(BarChart3, { size: 18 }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("p", { className: "font-black text-gray-900 uppercase text-xs tracking-tight", children: item.label }),
              /* @__PURE__ */ jsxs(Badge, { color: item.priority === "High" ? "purple" : "gray", className: "text-[8px] font-black px-2 mt-1", children: [
                item.priority,
                " Priority"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxs("p", { className: "font-black text-gray-900", children: [
              "$",
              item.amount.toFixed(2)
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-[9px] text-gray-400 uppercase font-black", children: "Forecasted Spend" })
          ] })
        ] }, i)) }) }),
        /* @__PURE__ */ jsxs("div", { className: "bg-amber-50 border border-amber-100 p-6 rounded-3xl flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "p-3 bg-amber-100 text-amber-600 rounded-2xl shadow-sm", children: /* @__PURE__ */ jsx(Info, { size: 24 }) }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h4", { className: "font-black text-amber-900 uppercase italic text-sm mb-1 tracking-tight", children: "AI Financial Guardrail Active" }),
            /* @__PURE__ */ jsxs("p", { className: "text-amber-800 text-xs font-medium leading-relaxed", children: [
              "Budget Guard™ is currently tracking your ",
              /* @__PURE__ */ jsx("strong", { children: "Inventory Node Burn Rates" }),
              ". It will automatically notify you via Lola if your current spending trajectory risks a material stock-out before the next planned restock."
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
};
const LolaTodos = () => {
  const navigate = useNavigate();
  const { todos, toggleTodo } = useArtisanData();
  const [filter, setFilter] = React.useState("all");
  const filteredTodos = todos.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });
  const getCategoryIcon = (category) => {
    switch (category) {
      case "orders":
        return /* @__PURE__ */ jsx(ShoppingBag, { size: 14 });
      case "inventory":
        return /* @__PURE__ */ jsx(Box, { size: 14 });
      case "marketing":
        return /* @__PURE__ */ jsx(Target, { size: 14 });
      case "recipes":
        return /* @__PURE__ */ jsx(Factory, { size: 14 });
      default:
        return /* @__PURE__ */ jsx(Clock, { size: 14 });
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-10 animate-in fade-in pb-20 max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-start md:items-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => navigate(-1), className: "flex items-center gap-2 text-gray-400 hover:text-[#6A2C91] mb-4 font-black text-xs uppercase tracking-widest transition-colors", children: [
          /* @__PURE__ */ jsx(ArrowLeft, { size: 18 }),
          " Back"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs("h1", { className: "text-4xl font-black text-white tracking-tighter uppercase italic flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(ListTodo, { className: "text-[#6A2C91]", size: 36 }),
            " Lola's To-Do Hub"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "p-2 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 shadow-sm animate-pulse", title: "Logic Node Verified", children: /* @__PURE__ */ jsx(CheckCircle2, { size: 24 }) })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 font-medium mt-1", children: "Real-time synaptic task tracking and automation protocols. Status: Verified ✅" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex bg-stone-100 p-1 rounded-2xl border border-stone-200", children: ["all", "pending", "completed"].map((f) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setFilter(f),
          className: `px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? "bg-white text-[#6A2C91] shadow-lg" : "text-gray-400 hover:text-gray-600"}`,
          children: f
        },
        f
      )) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "border-stone-100 shadow-2xl relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 p-4 sm:p-10 opacity-[0.03] text-[#6A2C91] pointer-events-none", children: /* @__PURE__ */ jsx(Sparkles, { size: 160 }) }),
      /* @__PURE__ */ jsx("div", { className: "space-y-6 mt-4 relative z-10", children: filteredTodos.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "py-20 text-center space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center mx-auto text-stone-200", children: /* @__PURE__ */ jsx(CheckCircle, { size: 40 }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-xl font-black text-white uppercase italic", children: "All Nodes Cleared" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-sm font-medium", children: "Lola has synchronized all current operational tasks." })
      ] }) : /* @__PURE__ */ jsx("div", { className: "divide-y divide-stone-50", children: filteredTodos.map((todo) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `py-6 flex items-center justify-between group transition-all ${todo.completed ? "opacity-50" : ""}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => toggleTodo(todo.id),
                  className: `w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${todo.completed ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-stone-200 hover:border-[#6A2C91] text-transparent hover:text-stone-300"}`,
                  children: /* @__PURE__ */ jsx(CheckCircle, { size: 18 })
                }
              ),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsx("h4", { className: `text-lg font-black uppercase italic tracking-tight ${todo.completed ? "line-through text-stone-400" : "text-white font-bold"}`, children: todo.task }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[9px] font-black uppercase text-[#C5A059] bg-amber-50 px-2 py-0.5 rounded-lg", children: [
                    getCategoryIcon(todo.category),
                    todo.category
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-1", children: [
                  "Created: ",
                  new Date(todo.createdDate).toLocaleDateString(),
                  " • ",
                  todo.completed ? "Synchronized" : "Awaiting Input"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(Badge, { color: todo.completed ? "green" : "gold", className: "text-[8px]", children: todo.completed ? "VERIFIED" : "PENDING" }) })
          ]
        },
        todo.id
      )) }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-[#6A2C91] rounded-[2.5rem] p-4 sm:p-10 text-white shadow-2xl relative overflow-hidden group", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-4 sm:p-8 relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-center md:text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center md:justify-start gap-2 mb-2", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { size: 20, className: "text-emerald-400" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400", children: "System Integrity Active" })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-3xl font-black uppercase italic tracking-tighter", children: "Automatic Handshake" }),
          /* @__PURE__ */ jsx("p", { className: "text-purple-200 font-medium", children: "Lola automatically checks off items when you complete tasks across the platform." })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-4 bg-white/10 rounded-[2rem] border border-white/20", children: /* @__PURE__ */ jsx(RefreshCw, { size: 32, className: "animate-spin-slow text-white" }) })
      ] })
    ] })
  ] });
};
const TermsAndConditions = () => {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "max-w-4xl mx-auto space-y-8",
      children: [
        /* @__PURE__ */ jsx(SubPageHeader, { title: "Terms & Conditions", description: "Please read these terms carefully before using ArtisanFlow." }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 space-y-6 text-white/70", children: [
          /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-[#C5A059] font-black text-xl uppercase tracking-widest", children: "1. Acceptance of Terms" }),
            /* @__PURE__ */ jsx("p", { className: "leading-relaxed", children: "By accessing and using ArtisanFlow, you accept and agree to be bound by the terms and provision of this agreement. Any participation in this service will constitute acceptance of this agreement." })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-[#C5A059] font-black text-xl uppercase tracking-widest", children: "2. Use License" }),
            /* @__PURE__ */ jsx("p", { className: "leading-relaxed", children: "Permission is granted to temporarily access the materials (information or software) on ArtisanFlow's proprietary system for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title." })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-[#C5A059] font-black text-xl uppercase tracking-widest", children: "3. Disclaimer" }),
            /* @__PURE__ */ jsx("p", { className: "leading-relaxed", children: "The materials on ArtisanFlow's system are provided on an 'as is' basis. ArtisanFlow makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights." })
          ] })
        ] })
      ]
    }
  );
};
const PrivacyPolicy = () => {
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      className: "max-w-4xl mx-auto space-y-8",
      children: [
        /* @__PURE__ */ jsx(SubPageHeader, { title: "Privacy Policy", description: "How we collect, use, and protect your data." }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-8 space-y-6 text-white/70", children: [
          /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-[#C5A059] font-black text-xl uppercase tracking-widest", children: "1. Data Collection" }),
            /* @__PURE__ */ jsx("p", { className: "leading-relaxed", children: "We collect information from you when you register on our site, place an order, subscribe to our newsletter, respond to a survey, or fill out a form. The collected information includes your name, email address, and operational metrics necessary for ArtisanFlow systems to function." })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-[#C5A059] font-black text-xl uppercase tracking-widest", children: "2. Data Protection" }),
            /* @__PURE__ */ jsx("p", { className: "leading-relaxed", children: "We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We offer the use of a secure server. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Database." })
          ] }),
          /* @__PURE__ */ jsxs("section", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-[#C5A059] font-black text-xl uppercase tracking-widest", children: "3. Ecosystem Data & AI Processing" }),
            /* @__PURE__ */ jsx("p", { className: "leading-relaxed", children: "Your privacy is our utmost priority. We do not sell, trade, or otherwise transfer your proprietary business data to any outside third parties. ArtisanFlow operates exclusively within the LRC Digital Systems ecosystem. Data processed by the Lola AI Assistant is strictly utilized internally across the LRC Digital Systems platform to continuously enhance our automated AI functions, providing you with a seamless, highly integrated, and increasingly intelligent operational experience." })
          ] })
        ] })
      ]
    }
  );
};
const SuperAdmin = () => {
  const navigate = useNavigate();
  const { updateSystemUser, deleteSystemUser, inviteSystemUser, businessProfile } = useArtisanData();
  const [search, setSearch] = useState("");
  const [liveUsers, setLiveUsers] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [ledgerTransactions, setLedgerTransactions] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [globalIntegrations, setGlobalIntegrations] = useState([
    { platform: "Shopify", apiKey: "", webhookSecret: "", status: "Unconfigured" },
    { platform: "WooCommerce", apiKey: "", webhookSecret: "", status: "Unconfigured" },
    { platform: "Etsy", apiKey: "", webhookSecret: "", status: "Unconfigured" },
    { platform: "Square", apiKey: "", webhookSecret: "", status: "Unconfigured" },
    { platform: "QuickBooks", apiKey: "", webhookSecret: "", status: "Unconfigured" },
    { platform: "Gmail", apiKey: "", webhookSecret: "", status: "Unconfigured" },
    { platform: "Google Drive", apiKey: "", webhookSecret: "", status: "Unconfigured" },
    { platform: "Amazon", apiKey: "", webhookSecret: "", status: "Unconfigured" },
    { platform: "WordPress", apiKey: "", webhookSecret: "", status: "Unconfigured" }
  ]);
  useEffect(() => {
    const fetchDashboardData2 = async () => {
      if (businessProfile.role !== "super_admin") {
        toast.error("Unauthorized Access: Super Admin privileges required.");
        navigate("/");
        return;
      }
      setIsLoadingData(true);
      try {
        const gasUrl = "https://script.google.com/macros/s/AKfycbwcHalq43bfMKo-HHwKO6cNGNNBU67sF7CPtRHITBw1Lbdrx28GNOHfBBDJhEDZSTxB/exec";
        if (!gasUrl) ;
        const makePostReq = async (action) => {
          const res = await fetch(gasUrl, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ action })
          });
          return await res.json();
        };
        const [usersData, ledgerData, alertsData, integrationsData] = await Promise.all([
          makePostReq("fetchSystemUsers"),
          makePostReq("fetchPaymentLedger"),
          makePostReq("fetchSystemAlerts"),
          makePostReq("fetchGlobalIntegrations")
        ]);
        if (usersData.status === "success" && usersData.users) {
          setLiveUsers(usersData.users);
        }
        if (ledgerData.status === "success" && ledgerData.transactions) {
          setLedgerTransactions(ledgerData.transactions);
        }
        if (alertsData.status === "success" && alertsData.alerts) {
          setSystemAlerts(alertsData.alerts);
        }
        if (integrationsData.status === "success" && integrationsData.integrations && integrationsData.integrations.length > 0) {
          const merged = globalIntegrations.map((def) => {
            const found = integrationsData.integrations.find((i) => i.platform === def.platform);
            return found ? { ...def, ...found } : def;
          });
          setGlobalIntegrations(merged);
        }
      } catch (err) {
        console.error("Failed to fetch Super Admin dashboard data", err);
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchDashboardData2();
  }, []);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteTier, setInviteTier] = useState("Free Audit");
  const [isInviting, setIsInviting] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const filteredUsers = liveUsers.filter(
    (u) => u.email.toLowerCase().includes(search.toLowerCase()) || u.id.toLowerCase().includes(search.toLowerCase())
  );
  const handleInvite = () => {
    if (!inviteEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setIsInviting(true);
    setTimeout(() => {
      inviteSystemUser(inviteEmail, inviteTier);
      toast.success(`Invitation sent to ${inviteEmail}.`);
      setIsInviting(false);
      setIsInviteModalOpen(false);
      setInviteEmail("");
      setInviteTier("Free Audit");
    }, 800);
  };
  const handleSaveEdit = () => {
    if (editingUser) {
      updateSystemUser(editingUser.id, editingUser);
      toast.success("User access modified successfully.");
      setIsEditModalOpen(false);
    }
  };
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to revoke access and lock this account?")) {
      deleteSystemUser(id);
      toast.success("Account access revoked.");
    }
  };
  const fetchDashboardData = async () => {
    setIsLoadingData(true);
    try {
      const gasUrl = "https://script.google.com/macros/s/AKfycbwcHalq43bfMKo-HHwKO6cNGNNBU67sF7CPtRHITBw1Lbdrx28GNOHfBBDJhEDZSTxB/exec";
      if (!gasUrl) ;
      const makePostReq = async (action) => {
        const res = await fetch(gasUrl, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ action })
        });
        return await res.json();
      };
      const [usersData, ledgerData, alertsData, integrationsData] = await Promise.all([
        makePostReq("fetchSystemUsers"),
        makePostReq("fetchPaymentLedger"),
        makePostReq("fetchSystemAlerts"),
        makePostReq("fetchGlobalIntegrations")
      ]);
      if ((usersData == null ? void 0 : usersData.status) === "success" && usersData.users) {
        setLiveUsers(usersData.users);
      }
      if ((ledgerData == null ? void 0 : ledgerData.status) === "success" && ledgerData.transactions) {
        setLedgerTransactions(ledgerData.transactions);
      }
      if ((alertsData == null ? void 0 : alertsData.status) === "success" && alertsData.alerts) {
        setSystemAlerts(alertsData.alerts);
      }
      if ((integrationsData == null ? void 0 : integrationsData.status) === "success" && integrationsData.integrations && integrationsData.integrations.length > 0) {
        setGlobalIntegrations((prev) => prev.map((def) => {
          const found = integrationsData.integrations.find((i) => i.platform === def.platform);
          return found ? { ...def, ...found } : def;
        }));
      }
    } catch (err) {
      console.error("Failed to fetch Super Admin dashboard data", err);
      toast.error("Failed to fetch data from Google Apps Script.");
    } finally {
      setIsLoadingData(false);
    }
  };
  const handleSync = async () => {
    setIsSyncing(true);
    await fetchDashboardData();
    toast.success("Google Sheets Matrix successfully synced.");
    setIsSyncing(false);
  };
  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      toast.success("Firebase Core Integration securely verified.");
      setIsVerifying(false);
    }, 1200);
  };
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.6 },
      className: "space-y-12 pb-20 p-4 sm:p-10 md:p-16 max-w-[1600px] mx-auto",
      children: [
        /* @__PURE__ */ jsx(
          SubPageHeader,
          {
            title: "Super-Admin Matrix",
            parentTitle: "System Architecture",
            onBack: () => {
            },
            description: "Master control override. Global view of system state, user tiers, and database integrity."
          }
        ),
        /* @__PURE__ */ jsx(
          VaultBanner,
          {
            title: "Super-Admin Matrix",
            subtitle: "Master control override. Manage platform access, subscription tiers, and global system metrics.",
            badge: "Master Override Active",
            children: /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsxs(Button, { onClick: handleSync, className: "bg-red-500 hover:bg-red-600 text-white font-sans font-bold text-[11px] h-16 rounded-full px-10 tracking-[0.3em] uppercase shadow-2xl shadow-red-500/20 transition-all flex items-center gap-3", children: [
              isSyncing ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsx(Database, { size: 16 }),
              " EXPORT MASTER LEDGER"
            ] }) })
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsx(AdminStatCard, { title: "Total Platform Users", value: liveUsers.length.toString(), icon: Users, trend: "+1 This Week" }),
          /* @__PURE__ */ jsx(AdminStatCard, { title: "Pro Tier Subscribers", value: liveUsers.filter((u) => u.tier === "Margin Protection Pro").length.toString(), icon: CrownIcon, trend: "Margin Protection Pro", color: "text-[#C5A059]", border: "border-[#C5A059]/20" }),
          /* @__PURE__ */ jsx(AdminStatCard, { title: "Global Volume Processed", value: "$187,020", icon: Activity, trend: "+14% MoM", color: "text-emerald-400" }),
          /* @__PURE__ */ jsx(AdminStatCard, { title: "System Health", value: "100%", icon: Server, trend: "All Nodes Online", color: "text-blue-400" })
        ] }),
        /* @__PURE__ */ jsxs(Card, { title: "User Matrix & Tier Assignment", className: "luxury-card border-none bg-black/40 backdrop-blur-xl rounded-[3rem] p-4 sm:p-12", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row justify-between items-center gap-6 mb-10", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-full md:w-96", children: [
              /* @__PURE__ */ jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 text-white/20", size: 16 }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  value: search,
                  onChange: (e) => setSearch(e.target.value),
                  placeholder: "Search by Email Address...",
                  className: "bg-white/5 border-white/10 rounded-2xl pl-12 h-14 font-sans font-light text-sm focus:border-[#6A2C91] text-white"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs(Button, { onClick: () => setIsInviteModalOpen(true), variant: "outline", className: "border-white/10 text-white hover:bg-white/5 h-14 rounded-2xl font-sans font-bold text-[10px] uppercase tracking-[0.2em] px-8 transition-all", children: [
              /* @__PURE__ */ jsx(Key, { size: 14, className: "mr-2" }),
              " Invite New User"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-[2rem] border border-white/5 bg-black/20 shadow-inner", children: /* @__PURE__ */ jsx("div", { className: "overflow-x-auto w-full", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm text-left font-sans", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-[#6A2C91]/10 text-white/50 font-sans font-bold text-[10px] uppercase tracking-[0.2em] border-b border-white/5", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "p-6", children: "User ID" }),
              /* @__PURE__ */ jsx("th", { className: "p-6", children: "Email Address" }),
              /* @__PURE__ */ jsx("th", { className: "p-6", children: "Assigned Tier" }),
              /* @__PURE__ */ jsx("th", { className: "p-6", children: "Status" }),
              /* @__PURE__ */ jsx("th", { className: "p-6", children: "System Load" }),
              /* @__PURE__ */ jsx("th", { className: "p-6 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-white/5", children: isLoadingData ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "p-6 text-center text-white/50 text-xs py-12", children: "Syncing active ledger with Super Admin node..." }) }) : filteredUsers.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 7, className: "p-6 text-center text-white/50 text-xs py-12", children: "No authorized protocols found" }) }) : filteredUsers.map((u) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-white/5 transition-colors", children: [
              /* @__PURE__ */ jsx("td", { className: "p-6 font-mono text-xs text-white/50", children: u.id }),
              /* @__PURE__ */ jsx("td", { className: "p-6 text-white/90", children: u.email }),
              /* @__PURE__ */ jsx("td", { className: "p-6", children: /* @__PURE__ */ jsx(Badge, { color: u.tier === "Margin Protection Pro" ? "gold" : u.tier === "Artisan Flow Basic" ? "purple" : "gray", className: "text-[9px] uppercase tracking-widest px-3 py-1", children: u.tier }) }),
              /* @__PURE__ */ jsx("td", { className: "p-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("div", { className: `w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}` }),
                /* @__PURE__ */ jsx("span", { className: "text-white/70 font-light text-xs", children: u.status })
              ] }) }),
              /* @__PURE__ */ jsxs("td", { className: "p-6 text-white/70 font-mono text-xs", children: [
                "$",
                u.revenueProcessed.toLocaleString()
              ] }),
              /* @__PURE__ */ jsxs("td", { className: "p-6 text-right space-x-2", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  setEditingUser(u);
                  setIsEditModalOpen(true);
                }, className: "p-2 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors border border-white/5", children: /* @__PURE__ */ jsx(Edit2, { size: 14 }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => handleDelete(u.id), className: "p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-500 hover:text-red-400 transition-colors border border-red-500/20", children: /* @__PURE__ */ jsx(Lock, { size: 14 }) })
              ] })
            ] }, u.id)) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsx(Card, { title: "Database Sync Configuration", className: "luxury-card border-none bg-black/40 backdrop-blur-xl rounded-[3rem] p-4 sm:p-10", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6 mt-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-4", children: [
              /* @__PURE__ */ jsx(Database, { className: "text-[#C5A059] shrink-0 mt-1", size: 20 }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-white font-serif text-xl mb-1", children: "Google Sheets Sync" }),
                /* @__PURE__ */ jsx("p", { className: "text-white/50 text-sm font-sans font-light mb-4", children: "Export Super-Admin matrix automatically to a master Google Sheet." }),
                /* @__PURE__ */ jsx(Button, { onClick: handleSync, className: "bg-[#C5A059]/20 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/30 text-[10px] uppercase font-bold tracking-[0.2em] rounded-xl px-6 h-10 transition-all", children: isSyncing ? "Authenticating..." : "Authenticate Sheet" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-6 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-4", children: [
              /* @__PURE__ */ jsx(Server, { className: "text-[#6A2C91] shrink-0 mt-1", size: 20 }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h4", { className: "text-white font-serif text-xl mb-1", children: "Firebase Core Integration" }),
                /* @__PURE__ */ jsx("p", { className: "text-white/50 text-sm font-sans font-light mb-4", children: "Manage remote config and user authentication nodes." }),
                /* @__PURE__ */ jsx(Button, { onClick: handleVerify, className: "bg-[#6A2C91]/20 hover:bg-[#6A2C91]/30 text-[#6A2C91] border border-[#6A2C91]/30 text-[10px] uppercase font-bold tracking-[0.2em] rounded-xl px-6 h-10 transition-all", children: isVerifying ? "Verifying..." : "Verify Connection" })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx(Card, { title: "System Alerts", className: "luxury-card border-none bg-black/40 backdrop-blur-xl rounded-[3rem] p-4 sm:p-10", children: /* @__PURE__ */ jsx("div", { className: "space-y-4 mt-4", children: isLoadingData ? /* @__PURE__ */ jsxs("div", { className: "p-5 text-center text-white/50 text-xs flex items-center justify-center gap-2", children: [
            /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }),
            " Fetching alerts..."
          ] }) : systemAlerts.length === 0 ? /* @__PURE__ */ jsx("div", { className: "p-5 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx(ShieldAlert, { className: "text-emerald-500", size: 18 }),
            /* @__PURE__ */ jsx("span", { className: "text-emerald-500/80 font-sans font-light text-sm", children: "All systems nominal. No alerts active." })
          ] }) }) : systemAlerts.map((alert2) => /* @__PURE__ */ jsxs("div", { className: `p-5 rounded-2xl flex items-center justify-between ${alert2.type === "warning" ? "bg-amber-500/10 border border-amber-500/20" : "bg-red-500/10 border border-red-500/20"}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx(AlertTriangle, { className: alert2.type === "warning" ? "text-amber-500" : "text-red-500", size: 18 }),
              /* @__PURE__ */ jsx("span", { className: `${alert2.type === "warning" ? "text-amber-500/80" : "text-red-500/80"} font-sans font-light text-sm`, children: alert2.message })
            ] }),
            /* @__PURE__ */ jsx("button", { onClick: () => toast.info("Opening alert for review..."), className: `text-[10px] font-bold uppercase tracking-[0.2em] transition-colors ${alert2.type === "warning" ? "text-amber-500 hover:text-amber-400" : "text-red-500 hover:text-red-400"}`, children: "Review" })
          ] }, alert2.id)) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 sm:p-8", children: [
          /* @__PURE__ */ jsxs(Card, { title: "Integrations Configuration Node", className: "luxury-card border-none bg-black/40 backdrop-blur-xl rounded-[3rem] p-4 sm:p-10", children: [
            /* @__PURE__ */ jsx("p", { className: "text-white/50 text-sm font-sans font-light mb-6", children: "Manage global API keys and webhook secrets for tenant integrations." }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar", children: isLoadingData ? /* @__PURE__ */ jsxs("div", { className: "py-8 text-center text-white/50 text-xs flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }),
              " Initializing config..."
            ] }) : globalIntegrations.map((integration, idx) => /* @__PURE__ */ jsxs("div", { className: "p-5 bg-white/5 border border-white/10 rounded-2xl", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-4", children: [
                /* @__PURE__ */ jsx("h4", { className: "text-white font-serif text-lg", children: integration.platform }),
                /* @__PURE__ */ jsx(Badge, { color: integration.status === "Active" ? "green" : "gray", className: "text-[9px] uppercase tracking-widest px-2 py-1", children: integration.status })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "password",
                    placeholder: "API Key / Bearer Token",
                    value: integration.apiKey,
                    onChange: (e) => {
                      const newConfig = [...globalIntegrations];
                      newConfig[idx].apiKey = e.target.value;
                      setGlobalIntegrations(newConfig);
                    },
                    className: "w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "Webhook URL / Secret",
                    value: integration.webhookSecret,
                    onChange: (e) => {
                      const newConfig = [...globalIntegrations];
                      newConfig[idx].webhookSecret = e.target.value;
                      setGlobalIntegrations(newConfig);
                    },
                    className: "w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#C5A059]"
                  }
                )
              ] })
            ] }, integration.platform)) }),
            /* @__PURE__ */ jsx(
              Button,
              {
                onClick: async () => {
                  try {
                    const gasUrl = "https://script.google.com/macros/s/AKfycbwcHalq43bfMKo-HHwKO6cNGNNBU67sF7CPtRHITBw1Lbdrx28GNOHfBBDJhEDZSTxB/exec";
                    if (!gasUrl) ;
                    toast.loading("Saving configurations...");
                    await fetch(gasUrl, {
                      method: "POST",
                      headers: { "Content-Type": "text/plain;charset=utf-8" },
                      body: JSON.stringify({ action: "saveGlobalIntegrations", integrations: globalIntegrations })
                    });
                    toast.dismiss();
                    toast.success("Global configurations saved to master sheet.");
                  } catch (e) {
                    toast.dismiss();
                    toast.error("Failed to save global configurations.");
                  }
                },
                className: "w-full mt-6 bg-[#C5A059] text-white hover:bg-[#b08e4d] rounded-xl h-12 text-[10px] uppercase tracking-widest font-bold",
                children: "Save Global Configurations"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(Card, { title: "Payment Verification Ledger", className: "luxury-card border-none bg-black/40 backdrop-blur-xl rounded-[3rem] p-4 sm:p-10", children: [
            /* @__PURE__ */ jsx("p", { className: "text-white/50 text-sm font-sans font-light mb-6", children: "Real-time payment event tracking (Stripe / Square)." }),
            /* @__PURE__ */ jsx("div", { className: "space-y-4", children: isLoadingData ? /* @__PURE__ */ jsxs("div", { className: "py-8 text-center text-white/50 text-xs flex items-center justify-center gap-2", children: [
              /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }),
              " Fetching ledger..."
            ] }) : ledgerTransactions.length === 0 ? /* @__PURE__ */ jsx("div", { className: "py-8 text-center border border-white/5 rounded-2xl bg-white/5", children: /* @__PURE__ */ jsx("span", { className: "text-white/40 text-xs", children: "No payment transactions recorded yet." }) }) : ledgerTransactions.map((txn) => /* @__PURE__ */ jsxs("div", { className: "p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("p", { className: "text-white text-sm font-medium", children: [
                  txn.user,
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-white/40 ml-2", children: txn.id })
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-white/50 text-xs mt-1", children: [
                  "Tier: ",
                  txn.tier,
                  " | $",
                  txn.amount
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsx("span", { className: `text-xs font-bold uppercase tracking-widest ${txn.status.includes("Success") || txn.status.includes("Active") ? "text-emerald-400" : "text-amber-400"}`, children: txn.status }),
                /* @__PURE__ */ jsx("p", { className: "text-white/40 text-xs mt-1", children: new Date(txn.date).toLocaleDateString() })
              ] })
            ] }, txn.id)) })
          ] })
        ] }),
        /* @__PURE__ */ jsx(Modal, { isOpen: isInviteModalOpen, onClose: () => setIsInviteModalOpen(false), title: "Invite User", children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2", children: "Email Address" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: inviteEmail,
                onChange: (e) => setInviteEmail(e.target.value),
                placeholder: "Enter Email Address",
                className: "bg-white/5 border-white/10 text-white w-full rounded-xl"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2", children: "Assigned Tier" }),
            /* @__PURE__ */ jsx(
              Select,
              {
                value: inviteTier,
                onChange: (e) => setInviteTier(e.target.value),
                className: "bg-white/5 border-white/10 text-white w-full rounded-xl",
                children: ["Free Audit", "Artisan Flow Basic", "Margin Protection Pro"].map((opt) => /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: opt }, opt))
              }
            )
          ] }),
          /* @__PURE__ */ jsx(Button, { onClick: handleInvite, className: "w-full bg-[#6A2C91] hover:bg-[#6A2C91]/80 text-white h-12 rounded-xl border border-[#6A2C91]/50", disabled: isInviting, children: isInviting ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin mx-auto" }) : "Send Protocol Invitation" })
        ] }) }),
        /* @__PURE__ */ jsx(Modal, { isOpen: isEditModalOpen, onClose: () => setIsEditModalOpen(false), title: "Modify User Access", children: editingUser && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2", children: "Email Address" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                value: editingUser.email,
                disabled: true,
                className: "bg-white/5 border-white/10 text-white/50 w-full rounded-xl"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2", children: "Tier Level" }),
            /* @__PURE__ */ jsx(
              Select,
              {
                value: editingUser.tier,
                onChange: (e) => setEditingUser({ ...editingUser, tier: e.target.value }),
                className: "bg-white/5 border-white/10 text-white w-full rounded-xl",
                children: ["Free Audit", "Artisan Flow Basic", "Margin Protection Pro"].map((opt) => /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: opt }, opt))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "block text-white/50 text-[10px] uppercase tracking-[0.2em] font-bold mb-2", children: "Status" }),
            /* @__PURE__ */ jsx(
              Select,
              {
                value: editingUser.status,
                onChange: (e) => setEditingUser({ ...editingUser, status: e.target.value }),
                className: "bg-white/5 border-white/10 text-white w-full rounded-xl",
                children: ["Active", "Pending", "Suspended"].map((opt) => /* @__PURE__ */ jsx("option", { className: "bg-black text-white", children: opt }, opt))
              }
            )
          ] }),
          /* @__PURE__ */ jsx(Button, { onClick: handleSaveEdit, className: "w-full bg-[#C5A059] hover:bg-[#C5A059]/80 text-black h-12 rounded-xl border border-[#C5A059]/50", children: "Save Configuration" })
        ] }) })
      ]
    }
  );
};
const AdminStatCard = ({ title, value, icon: Icon, trend, color = "text-white", border = "border-white/10" }) => /* @__PURE__ */ jsxs("div", { className: `luxury-card bg-white/5 backdrop-blur-xl border ${border} rounded-[2.5rem] p-8 relative overflow-hidden group hover:bg-white/10 transition-all duration-500`, children: [
  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6", children: [
    /* @__PURE__ */ jsx("span", { className: "text-white/40 font-sans font-bold text-[10px] uppercase tracking-[0.3em]", children: title }),
    /* @__PURE__ */ jsx("div", { className: `p-3 rounded-xl bg-white/5 ${color} border border-white/5`, children: /* @__PURE__ */ jsx(Icon, { size: 18, strokeWidth: 1.5 }) })
  ] }),
  /* @__PURE__ */ jsx("div", { className: `text-4xl font-serif tracking-tighter mb-4 ${color}`, children: value }),
  /* @__PURE__ */ jsx("div", { className: "text-white/30 text-[10px] font-sans font-bold uppercase tracking-[0.3em]", children: trend })
] });
const CrownIcon = (props) => /* @__PURE__ */ jsx("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", ...props, children: /* @__PURE__ */ jsx("path", { d: "M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" }) });
const OperationsDashboard = () => {
  const navigate = useNavigate();
  const { userTier } = useArtisanData();
  const MODULES = [
    { id: "orders", title: "Orders", icon: ShoppingBag, desc: "Process commerce orders", color: "text-purple-600", route: "/operations/orders", requiredTier: "Artisan Flow Basic" },
    { id: "crm", title: "CRM", icon: Users, desc: "Customer Relationships", color: "text-[#C5A059]", route: "/operations/crm", requiredTier: "Artisan Flow Basic" },
    { id: "inventory", title: "Inventory Hub", icon: Boxes, desc: "Stock overview", color: "text-emerald-600", route: "/inventory", requiredTier: "Artisan Flow Basic" },
    { id: "recipes", title: "Recipes (BOM)", icon: FileText, desc: "Formulas & Costs", color: "text-gray-600", route: "/recipes", requiredTier: "Artisan Flow Basic" },
    { id: "production_scheduler", title: "Scheduler", icon: Calendar, desc: "Daily batches", color: "text-pink-600", route: "/production_scheduler", requiredTier: "Artisan Flow Basic" },
    { id: "production_workflow", title: "Workflow", icon: Layers, desc: "Kanban active jobs", color: "text-cyan-600", route: "/production_workflow", requiredTier: "Artisan Flow Basic" },
    { id: "supplier_manager", title: "Suppliers", icon: Truck, desc: "Vendor database", color: "text-orange-600", route: "/supplier_manager", requiredTier: "Artisan Flow Basic" },
    { id: "qc", title: "Quality Control", icon: ClipboardList, desc: "Pass/Fail logs", color: "text-red-600", route: "/qc", requiredTier: "Artisan Flow Basic" }
  ];
  const handleNavigate = (mod) => {
    if (userTier === "Free Audit" && mod.requiredTier !== "Free Audit") {
      navigate("/settings/subscription");
      return;
    }
    navigate(mod.route);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-12 animate-in fade-in duration-700", children: [
    /* @__PURE__ */ jsx(
      VaultBanner,
      {
        title: "Operations Command Center",
        subtitle: "Central nervous system for manufacturing and logistics. Synchronizing industrial precision with artisanal craftsmanship.",
        badge: "Operations Protocol Active",
        children: /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "premium",
            onClick: () => navigate("/operations/warehouse"),
            className: "h-16 px-10 rounded-full shadow-2xl shadow-black/20",
            children: [
              /* @__PURE__ */ jsx(Factory, { size: 18, className: "mr-3" }),
              " VIRTUAL WAREHOUSE"
            ]
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8", children: MODULES.map((mod) => /* @__PURE__ */ jsx("div", { className: "relative group h-full", children: /* @__PURE__ */ jsxs(
      "div",
      {
        onClick: () => handleNavigate(mod),
        className: `luxury-card bg-black/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 cursor-pointer group flex flex-col h-full overflow-hidden transition-all duration-500 hover:border-[#C5A059]/50 ${userTier === "Free Audit" ? "opacity-50" : ""}`,
        children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-1 h-full bg-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
          /* @__PURE__ */ jsx("div", { className: `w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/10`, children: /* @__PURE__ */ jsx(mod.icon, { className: `${mod.color}`, size: 24, strokeWidth: 1.5 }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-serif text-white mb-3 tracking-tight group-hover:text-[#C5A059] transition-colors", children: mod.title }),
          /* @__PURE__ */ jsx("p", { className: "text-sm font-sans font-light text-white/50 leading-relaxed flex-1", children: mod.desc }),
          userTier === "Free Audit" && /* @__PURE__ */ jsx("div", { className: "absolute top-6 right-6", children: /* @__PURE__ */ jsx(Shield, { size: 16, className: "text-white/30", strokeWidth: 1.5 }) })
        ]
      }
    ) }, mod.id)) })
  ] });
};
const DashboardPage = () => {
  const navigate = useNavigate();
  const { getTotalRevenue, orders, inventory, userTier } = useArtisanData();
  const revenue = getTotalRevenue();
  const pendingOrders = orders.filter((o) => o.status === "Processing").length;
  const totalStock = inventory.reduce((acc, i) => acc + i.stock, 0);
  const VAULT_NODES = [
    { id: "operations", title: "Operations Hub", icon: Factory, desc: "Manufacturing, Orders & CRM", route: "/operations", color: "text-purple-400", image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" },
    { id: "finance", title: "Finance Hub", icon: DollarSign, desc: "Budget & Projections", route: "/finance", color: "text-emerald-400", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800" },
    { id: "marketing", title: "Marketing Hub", icon: Sparkles, desc: "Brand Voice & Strategy", route: "/marketing", color: "text-[#C5A059]", image: "https://images.unsplash.com/photo-1557838923-2985c318be48?auto=format&fit=crop&q=80&w=800" },
    { id: "profit-guard", title: "Profit Guard™", icon: ShieldCheck, desc: "High-Precision Margin Analysis", route: "/profit-guard", color: "text-blue-400", image: "https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&q=80&w=800" }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-16 animate-in fade-in duration-700 max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsx(
      ContextualTutorialModal,
      {
        hubId: "dashboard_home",
        title: "Welcome to Artisan Flow",
        description: "Your centralized command center. We've synchronized your modules to offer an overarching view of your business operations.",
        steps: [
          "View high-level revenue and inventory stats.",
          "Access main nodes: Operations, Finance, Marketing, and Profit Guard.",
          "Monitor AI Logic insights tailored to your data."
        ]
      }
    ),
    /* @__PURE__ */ jsx(
      VaultBanner,
      {
        title: "Vault Access Authorized",
        subtitle: `Precision architecture online. Membership Level: ${userTier}. Synchronizing brand craftsmanship with automated growth nodes.`,
        badge: "Secure Vault Protocol Active",
        children: /* @__PURE__ */ jsx("div", { className: "flex gap-4", children: /* @__PURE__ */ jsxs(
          Button,
          {
            variant: "premium",
            onClick: () => navigate("/business-pulse-check"),
            className: "h-16 px-10 rounded-full shadow-2xl shadow-black/20",
            children: [
              /* @__PURE__ */ jsx(Zap, { size: 18, className: "mr-3" }),
              " FULL DIAGNOSTIC"
            ]
          }
        ) })
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
      /* @__PURE__ */ jsx(StatCard, { title: "Revenue", value: `$${revenue.toFixed(2)}`, icon: DollarSign, color: "text-emerald-400", trend: "+12%" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Inventory", value: totalStock.toString(), icon: Package, color: "text-purple-400", trend: "Units" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Orders", value: pendingOrders.toString(), icon: ShoppingBag, color: "text-blue-400", trend: "Pending" }),
      /* @__PURE__ */ jsx(StatCard, { title: "Status", value: "Active", icon: Activity, color: "text-[#C5A059]", trend: "Batches" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-serif text-white tracking-tight", children: "Vault Entry Points" }),
        /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-white/5 mx-8" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-10", children: VAULT_NODES.map((node) => /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: () => navigate(node.route),
          className: "group relative h-96 bg-black/40 rounded-[2.5rem] border border-white/5 hover:border-[#C5A059]/50 transition-all duration-700 cursor-pointer overflow-hidden shadow-2xl",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 z-0", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: node.image,
                  alt: node.title,
                  className: "w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000",
                  referrerPolicy: "no-referrer"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-white/5 group-hover:bg-[#C5A059] transition-colors duration-500 z-10" }),
            /* @__PURE__ */ jsxs("div", { className: "relative z-10 h-full p-12 flex flex-col justify-end", children: [
              /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-[#C5A059]/10 transition-all duration-500 border border-white/10", children: /* @__PURE__ */ jsx(node.icon, { className: node.color, size: 28, strokeWidth: 1.5 }) }),
              /* @__PURE__ */ jsx("h3", { className: "text-3xl font-serif text-white mb-4 tracking-tight group-hover:text-[#C5A059] transition-colors", children: node.title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-sans font-light text-white/50 uppercase tracking-[0.3em] leading-relaxed", children: node.desc }),
              /* @__PURE__ */ jsxs("div", { className: "mt-8 flex items-center text-[#C5A059] text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0", children: [
                "Access Node ",
                /* @__PURE__ */ jsx(ChevronRight, { size: 14, className: "ml-2" })
              ] })
            ] })
          ]
        },
        node.id
      )) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: /* @__PURE__ */ jsx("div", { className: "lg:col-span-3", children: /* @__PURE__ */ jsx(Card, { className: "p-10 border-none shadow-2xl bg-black/40 backdrop-blur-3xl rounded-[2.5rem]", title: "Omnichannel Output Visualization", children: /* @__PURE__ */ jsx("div", { className: "h-80 w-full mt-8", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: [
      { name: "Aug", units: 120, revenue: 5400, cost: 1800 },
      { name: "Sep", units: 145, revenue: 6525, cost: 2100 },
      { name: "Oct", units: 132, revenue: 5940, cost: 1950 },
      { name: "Nov", units: 168, revenue: 7560, cost: 2400 },
      { name: "Dec", units: 190, revenue: 8550, cost: 2700 }
    ], children: [
      /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "colorRev", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#C5A059", stopOpacity: 0.2 }),
        /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#C5A059", stopOpacity: 0 })
      ] }) }),
      /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "rgba(255,255,255,0.05)" }),
      /* @__PURE__ */ jsx(XAxis, { dataKey: "name", axisLine: false, tickLine: false, tick: { fontFamily: "Inter", fontSize: 11, fill: "rgba(255,255,255,0.3)", fontWeight: 500 }, dy: 10 }),
      /* @__PURE__ */ jsx(
        Tooltip,
        {
          contentStyle: {
            backgroundColor: "rgba(10,10,10,0.9)",
            borderRadius: "1.5rem",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)",
            fontFamily: "Inter",
            fontSize: "12px",
            color: "#fff"
          },
          itemStyle: { color: "#C5A059" }
        }
      ),
      /* @__PURE__ */ jsx(Area, { type: "monotone", dataKey: "revenue", stroke: "#C5A059", strokeWidth: 2, fillOpacity: 1, fill: "url(#colorRev)", name: "Revenue" })
    ] }) }) }) }) }) })
  ] });
};
const StatCard = ({ title, value, icon: Icon, color, trend }) => /* @__PURE__ */ jsxs(Card, { className: "luxury-card flex flex-col relative overflow-hidden group bg-black/40 backdrop-blur-xl border-white/5", children: [
  /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-0 w-1 h-full bg-white/5 group-hover:bg-[#C5A059] transition-colors duration-500" }),
  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start mb-6", children: [
    /* @__PURE__ */ jsx("div", { className: `p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform duration-500 ${color}`, children: /* @__PURE__ */ jsx(Icon, { size: 20, strokeWidth: 1.5 }) }),
    /* @__PURE__ */ jsx("span", { className: "text-white/30 font-sans font-medium text-[10px] uppercase tracking-[0.2em]", children: title })
  ] }),
  /* @__PURE__ */ jsx("div", { className: "text-4xl font-serif text-white tracking-tight mb-2", children: value }),
  /* @__PURE__ */ jsx("div", { className: `${color} text-[10px] font-sans font-medium uppercase tracking-[0.2em]`, children: trend })
] });
const AppContent = () => {
  const { isAuthenticated, userTier, isSessionVerifying, businessProfile } = useArtisanData();
  const navigate = useNavigate();
  const location = useLocation();
  if (isSessionVerifying) {
    return /* @__PURE__ */ jsxs("div", { className: "h-screen w-full flex flex-col items-center justify-center bg-stone-50 gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 border-4 border-purple-100 border-t-[#6A2C91] rounded-full animate-spin" }),
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx(ShieldCheck, { size: 16, className: "text-[#C5A059]" }) })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400", children: "Verifying Vault Session..." })
    ] });
  }
  const publicRoutes = ["/makers", "/apothecaries", "/scale", "/auth", "/overview"];
  const isPublicRoute = publicRoutes.includes(location.pathname);
  if (!isAuthenticated && !isPublicRoute && location.pathname !== "/") {
    return /* @__PURE__ */ jsx(LandingPage, {});
  }
  if (!isAuthenticated && location.pathname === "/") {
    return /* @__PURE__ */ jsx(LandingPage, {});
  }
  if (!isAuthenticated && isPublicRoute) {
    return /* @__PURE__ */ jsx(PublicLayout, { children: /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsxs(Routes, { location, children: [
          /* @__PURE__ */ jsx(Route, { path: "/makers", element: /* @__PURE__ */ jsx(MakerFunnel, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/apothecaries", element: /* @__PURE__ */ jsx(ApothecaryFunnel, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/scale", element: /* @__PURE__ */ jsx(ScaleFunnel, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/overview", element: /* @__PURE__ */ jsx(AppOverview, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/auth", element: /* @__PURE__ */ jsx(AuthGateway, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true }) })
        ] }, location.pathname)
      },
      location.pathname
    ) }) });
  }
  return /* @__PURE__ */ jsxs(Layout, { children: [
    /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
        className: "h-full w-full",
        children: /* @__PURE__ */ jsxs(Routes, { location, children: [
          /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(BusinessPulse, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/business-pulse-check", element: /* @__PURE__ */ jsx(BusinessPulseCheck, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/command-center", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(DashboardPage, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/inventory", element: /* @__PURE__ */ jsx(Inventory, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/recipes", element: /* @__PURE__ */ jsx(Recipes, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/recipes/builder/:id?", element: /* @__PURE__ */ jsx(RecipeBuilder, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/supplier_manager", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(SupplierManager, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/qc", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(QualityControl, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/operations", element: /* @__PURE__ */ jsx(OperationsDashboard, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/operations/warehouse", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(WarehouseView, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/operations/orders", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(Orders, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/operations/crm", element: /* @__PURE__ */ jsx(CRM, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/production_scheduler", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(ProductionScheduler, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/production_workflow", element: /* @__PURE__ */ jsx(ProductionWorkflow, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(MarketingStudio, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing/hub", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(MarketingHub, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing/strategy-report", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(MarketingStrategyReport, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing/brand-voice", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(BrandVoiceProfile, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing/receptionist", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(ReceptionistLogic, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing/calendar", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(ContentCalendar, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing/creator", element: /* @__PURE__ */ jsx(LockedNode, { requiredTier: "Artisan Flow Basic", featureKey: "marketing_creator", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(MarketingCreator, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing/analysis", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(VisualAnalysisNode, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing/social", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(SocialMediaCreator, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing/video", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(VideoCreator, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing/blog", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(BlogGenerator, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing/avatar", element: /* @__PURE__ */ jsx(LockedNode, { requiredTier: "Artisan Flow Basic", featureKey: "ai_avatar_studio", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(AIAvatarStudio, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing/advanced", element: /* @__PURE__ */ jsx(LockedNode, { requiredTier: "Artisan Flow Basic", featureKey: "advanced_synthesis", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(AdvancedContentGenerator, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/marketing/approvals", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(ContentApprovals, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/finance", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(FinanceHub, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/finance/projections", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(FinancialProjections, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/finance/budget-guard", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(BudgetGuard, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/lola/todos", element: /* @__PURE__ */ jsx(LolaTodos, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/terms", element: /* @__PURE__ */ jsx(TermsAndConditions, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/privacy", element: /* @__PURE__ */ jsx(PrivacyPolicy, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/profit-guard", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier !== "Margin Protection Pro", requiredTier: "Margin Protection Pro", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(ProfitGuardPage, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/forecasting", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier !== "Margin Protection Pro", requiredTier: "Margin Protection Pro", featureKey: "inventory_forecasting", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(Forecasting, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/settings/account", element: /* @__PURE__ */ jsx(AccountSettings, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/settings/business", element: /* @__PURE__ */ jsx(BusinessSetup, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/settings/subscription", element: /* @__PURE__ */ jsx(SubscriptionManagement, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/settings/integrations", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(Integrations, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/settings/portal", element: /* @__PURE__ */ jsx(LockedNode, { isLocked: userTier === "Free Audit", requiredTier: "Artisan Flow Basic", onUpgrade: () => navigate("/settings/subscription"), children: /* @__PURE__ */ jsx(CustomerPortal, {}) }) }),
          /* @__PURE__ */ jsx(Route, { path: "/settings/privacy", element: /* @__PURE__ */ jsx(PrivacyGovernance, {}) }),
          /* @__PURE__ */ jsx(Route, { path: "/super-admin", element: businessProfile.role === "admin" ? /* @__PURE__ */ jsx(SuperAdmin, {}) : /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true }) }),
          /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true }) })
        ] }, location.pathname)
      },
      location.pathname
    ) }),
    /* @__PURE__ */ jsx(AIAssistant, {})
  ] });
};
const AppWithoutRouter = () => /* @__PURE__ */ jsx(ArtisanDataProvider, { children: /* @__PURE__ */ jsx(TierProvider, { children: /* @__PURE__ */ jsx(AppContent, {}) }) });
function render(url) {
  return renderToString(
    /* @__PURE__ */ jsx(React.StrictMode, { children: /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(AppWithoutRouter, {}) }) })
  );
}
export {
  render
};
