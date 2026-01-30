import mongoose from "mongoose";

const positionSchema = new mongoose.Schema(
  {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    width: { type: Number, default: 100 },
    height: { type: Number, default: 50 }
  },
  { _id: false }
);


const invoiceCustomizationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registeration",
      required: true,
      index: true,
    },

    templateName: {
      type: String,
      required: true,
    },

    // colors

    primaryColor: { type: String, default: "#4F46E5" }, 
    secondaryColor: { type: String, default: "#10B981" }, 
    textColor: { type: String, default: "#1F2937" }, 
    backgroundColor: { type: String, default: "#FFFFFF" }, 
    borderColor: { type: String, default: "#E5E7EB" }, 

    // ---------------- TYPOGRAPHY ----------------
    typography: {
      headingFont: { type: String, default: "Inter" },
      bodyFont: { type: String, default: "Inter" },
      headingSize: { type: Number, default: 24 }, 
      bodySize: { type: Number, default: 14 }, 
    },

    //logo
    logo: {type: String,default: "",},

    //invoice details
    invoiceNo: {type: String, default: "",},
    invoiceDate: {type: Date,default: Date.now,},
    poNo: {type: String,default: "",},
    dueDate: {type: Date,default: null,},

    // invoice content styles
    // invoicefrom
    fromName:{type: String},
    fromAddress:{type: String},
    fromCity:{type: String},
    fromState:{type: String},
    fromZip:{type: String},

    // invoiceto
    toName:{type: String},
    toAddress:{type: String},
    toCity:{type: String},
    toState:{type: String},
    toZip:{type: String},
    
    // shipto
    shipToName:{type: String},
    shipToAddress:{type: String},
    shipToCity:{type: String},
    shipToState:{type: String},
    shipToZip:{type: String},


    items:{
        description:{type: String},
        quantity:{type: String},
        rate:{type: String},
        amount:{type: String},
        subtotal:{type: String},
        tax:{type: String},
        grandTotal:{type: String}
    },

    termsAndConditions: [{ type: String }],
    paymentInformation: {
        bankName: { type: String },
        accountNumber: { type: String },
        ifscCode: { type: String },

    },

    //scan to pay QR code
    qrCode: {
      type: String, // URL or file path
      default: "",
    },

    authorizedSignature: {
      type: String, // URL or file path
      default: "",
    },

    email:{type: String},
    phone:{type: String},
    website:{type: String},

    //section visibility
    businessInfo: { type: Boolean, default: true },
    clientInfo: { type: Boolean, default: true },
    shipTo: { type: Boolean, default: true },
    invoiceMeta: { type: Boolean, default: true },
    itemsTable: { type: Boolean, default: true },
    totals:{ type: Boolean, default: true },
    terms: { type: Boolean, default: true },
    paymentInfo: { type: Boolean, default: true },
    

    //positoning
    logoPosition: { type: positionSchema, default: { x: 50, y: 200, width: 300, height: 40 } },
    invoiceMetaPosition: { type: positionSchema, default: { x: 500, y: 50, width: 200, height: 120 } },
    businessInfoPosition: { type: positionSchema, default: { x: 50, y: 260, width: 220, height: 150 } },
    clientInfoPosition: { type: positionSchema, default: { x: 290, y: 260, width: 220, height: 120 } },
    shipToPosition: { type: positionSchema, default: { x: 530, y: 260, width: 220, height: 120 } },
    itemsTablePosition: { type: positionSchema, default: { x: 50, y: 430, width: 700, height: 200 } },
    totalsPosition: { type: positionSchema, default: { x: 500, y: 650, width: 250, height: 120 } },
    termsPosition: { type: positionSchema, default: { x: 50, y: 650, width: 400, height: 120 } },
    paymentInfoPosition: { type: positionSchema, default: { x: 50, y: 780, width: 300, height: 120 } },
    qrCodePosition: { type: positionSchema, default: { x: 380, y: 780, width: 190, height: 100 } },
    signaturePosition: { type: positionSchema, default: { x: 560, y: 780, width: 190, height: 100 } },
    footerPosition: { type: positionSchema, default: { x: 50, y: 950, width: 700, height: 60 } },

    // background pattern 

    backgroundPattern: {type: String,
    enum: ['none', 'waves1', 'waves2', 'curves', 'geometric', 'diagonal', 'circles', 'abstract', 'minimal', 'gradient'],
    default: 'none'
  },
  backgroundHeaderColor: {
    type: String,
    default: '#4F46E5'
  },
  backgroundFooterColor: {
    type: String,
    default: '#4F46E5'
  },
},

  { timestamps: true }
);

export default mongoose.model("InvoiceCustomization", invoiceCustomizationSchema);
