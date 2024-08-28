/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./common/components/portal/components/Portal.ts":
/*!*******************************************************!*\
  !*** ./common/components/portal/components/Portal.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom */ \"react-dom\");\n/* harmony import */ var react_dom__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_dom__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst Portal = ({ children  })=>{\n    const { 0: portal , 1: setPortal  } = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)();\n    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{\n        const node = document.getElementById('portal');\n        if (node) setPortal(node);\n    }, []);\n    if (!portal) return null;\n    return (0,react_dom__WEBPACK_IMPORTED_MODULE_1__.createPortal)(children, portal);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Portal);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21tb24vY29tcG9uZW50cy9wb3J0YWwvY29tcG9uZW50cy9Qb3J0YWwudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBMkM7QUFFSDtBQUV4QyxLQUFLLENBQUNHLE1BQU0sSUFBSSxDQUFDLENBQUNDLFFBQVEsRUFBNEMsQ0FBQyxHQUFLLENBQUM7SUFDM0UsS0FBSyxNQUFFQyxNQUFNLE1BQUVDLFNBQVMsTUFBSUwsK0NBQVE7SUFFcENELGdEQUFTLEtBQU8sQ0FBQztRQUNmLEtBQUssQ0FBQ08sSUFBSSxHQUFHQyxRQUFRLENBQUNDLGNBQWMsQ0FBQyxDQUFRO1FBQzdDLEVBQUUsRUFBRUYsSUFBSSxFQUFFRCxTQUFTLENBQUNDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRVAsRUFBRSxHQUFHRixNQUFNLEVBQUUsTUFBTSxDQUFDLElBQUk7SUFFeEIsTUFBTSxDQUFDSCx1REFBWSxDQUFDRSxRQUFRLEVBQUVDLE1BQU07QUFDdEMsQ0FBQztBQUVELGlFQUFlRixNQUFNLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9za2V0Y2gtc3luYy8uL2NvbW1vbi9jb21wb25lbnRzL3BvcnRhbC9jb21wb25lbnRzL1BvcnRhbC50cz9mNTkzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IGNyZWF0ZVBvcnRhbCB9IGZyb20gJ3JlYWN0LWRvbSc7XG5cbmNvbnN0IFBvcnRhbCA9ICh7IGNoaWxkcmVuIH06IHsgY2hpbGRyZW46IEpTWC5FbGVtZW50IHwgSlNYLkVsZW1lbnRbXSB9KSA9PiB7XG4gIGNvbnN0IFtwb3J0YWwsIHNldFBvcnRhbF0gPSB1c2VTdGF0ZTxIVE1MRWxlbWVudD4oKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9ydGFsJyk7XG4gICAgaWYgKG5vZGUpIHNldFBvcnRhbChub2RlKTtcbiAgfSwgW10pO1xuXG4gIGlmICghcG9ydGFsKSByZXR1cm4gbnVsbDtcblxuICByZXR1cm4gY3JlYXRlUG9ydGFsKGNoaWxkcmVuLCBwb3J0YWwpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUG9ydGFsO1xuIl0sIm5hbWVzIjpbInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiY3JlYXRlUG9ydGFsIiwiUG9ydGFsIiwiY2hpbGRyZW4iLCJwb3J0YWwiLCJzZXRQb3J0YWwiLCJub2RlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./common/components/portal/components/Portal.ts\n");

/***/ }),

/***/ "./common/constants/easings.ts":
/*!*************************************!*\
  !*** ./common/constants/easings.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"DEFAULT_EASE\": () => (/* binding */ DEFAULT_EASE)\n/* harmony export */ });\nconst DEFAULT_EASE = [\n    0.6,\n    0.01,\n    -0.05,\n    0.9\n];\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21tb24vY29uc3RhbnRzL2Vhc2luZ3MudHMuanMiLCJtYXBwaW5ncyI6Ijs7OztBQUFPLEtBQUssQ0FBQ0EsWUFBWSxHQUFHLENBQUM7QUFBQSxPQUFHO0FBQUUsUUFBSTtLQUFHLElBQUk7QUFBRSxPQUFHO0FBQUEsQ0FBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NrZXRjaC1zeW5jLy4vY29tbW9uL2NvbnN0YW50cy9lYXNpbmdzLnRzPzYzNzkiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IERFRkFVTFRfRUFTRSA9IFswLjYsIDAuMDEsIC0wLjA1LCAwLjldO1xuIl0sIm5hbWVzIjpbIkRFRkFVTFRfRUFTRSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./common/constants/easings.ts\n");

/***/ }),

/***/ "./modules/modal/animations/ModalManager.animations.ts":
/*!*************************************************************!*\
  !*** ./modules/modal/animations/ModalManager.animations.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"bgAnimation\": () => (/* binding */ bgAnimation),\n/* harmony export */   \"modalAnimation\": () => (/* binding */ modalAnimation)\n/* harmony export */ });\nconst bgAnimation = {\n    closed: {\n        opacity: 0\n    },\n    opened: {\n        opacity: 1\n    }\n};\nconst modalAnimation = {\n    closed: {\n        y: -100\n    },\n    opened: {\n        y: 0\n    },\n    exited: {\n        y: 100\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tb2R1bGVzL21vZGFsL2FuaW1hdGlvbnMvTW9kYWxNYW5hZ2VyLmFuaW1hdGlvbnMudHMuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBTyxLQUFLLENBQUNBLFdBQVcsR0FBRyxDQUFDO0lBQzFCQyxNQUFNLEVBQUUsQ0FBQztRQUFDQyxPQUFPLEVBQUUsQ0FBQztJQUFDLENBQUM7SUFDdEJDLE1BQU0sRUFBRSxDQUFDO1FBQUNELE9BQU8sRUFBRSxDQUFDO0lBQUMsQ0FBQztBQUN4QixDQUFDO0FBRU0sS0FBSyxDQUFDRSxjQUFjLEdBQUcsQ0FBQztJQUM3QkgsTUFBTSxFQUFFLENBQUM7UUFBQ0ksQ0FBQyxHQUFHLEdBQUc7SUFBQyxDQUFDO0lBQ25CRixNQUFNLEVBQUUsQ0FBQztRQUFDRSxDQUFDLEVBQUUsQ0FBQztJQUFDLENBQUM7SUFDaEJDLE1BQU0sRUFBRSxDQUFDO1FBQUNELENBQUMsRUFBRSxHQUFHO0lBQUMsQ0FBQztBQUNwQixDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2tldGNoLXN5bmMvLi9tb2R1bGVzL21vZGFsL2FuaW1hdGlvbnMvTW9kYWxNYW5hZ2VyLmFuaW1hdGlvbnMudHM/MDYzMSJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgYmdBbmltYXRpb24gPSB7XG4gIGNsb3NlZDogeyBvcGFjaXR5OiAwIH0sXG4gIG9wZW5lZDogeyBvcGFjaXR5OiAxIH0sXG59O1xuXG5leHBvcnQgY29uc3QgbW9kYWxBbmltYXRpb24gPSB7XG4gIGNsb3NlZDogeyB5OiAtMTAwIH0sXG4gIG9wZW5lZDogeyB5OiAwIH0sXG4gIGV4aXRlZDogeyB5OiAxMDAgfSxcbn07XG4iXSwibmFtZXMiOlsiYmdBbmltYXRpb24iLCJjbG9zZWQiLCJvcGFjaXR5Iiwib3BlbmVkIiwibW9kYWxBbmltYXRpb24iLCJ5IiwiZXhpdGVkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./modules/modal/animations/ModalManager.animations.ts\n");

/***/ }),

/***/ "./modules/modal/components/ModalManager.tsx":
/*!***************************************************!*\
  !*** ./modules/modal/components/ModalManager.tsx ***!
  \***************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! framer-motion */ \"framer-motion\");\n/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! recoil */ \"recoil\");\n/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(recoil__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _common_components_portal_components_Portal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @/common/components/portal/components/Portal */ \"./common/components/portal/components/Portal.ts\");\n/* harmony import */ var _animations_ModalManager_animations__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../animations/ModalManager.animations */ \"./modules/modal/animations/ModalManager.animations.ts\");\n/* harmony import */ var _recoil_modal_atom__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../recoil/modal.atom */ \"./modules/modal/recoil/modal.atom.tsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([framer_motion__WEBPACK_IMPORTED_MODULE_2__]);\nframer_motion__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\n\n\nconst ModalManager = ()=>{\n    const [{ opened , modal  }, setModal] = (0,recoil__WEBPACK_IMPORTED_MODULE_3__.useRecoilState)(_recoil_modal_atom__WEBPACK_IMPORTED_MODULE_6__.modalAtom);\n    const { 0: portalNode , 1: setPortalNode  } = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        if (!portalNode) {\n            const node = document.getElementById('portal');\n            if (node) setPortalNode(node);\n            return;\n        }\n        if (opened) {\n            portalNode.style.pointerEvents = 'all';\n        } else {\n            portalNode.style.pointerEvents = 'none';\n        }\n    }, [\n        opened,\n        portalNode\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_common_components_portal_components_Portal__WEBPACK_IMPORTED_MODULE_4__[\"default\"], {\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_2__.motion.div, {\n            className: \"absolute z-40 flex min-h-full w-full items-center justify-center bg-black/80\",\n            onClick: ()=>setModal({\n                    modal: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {}, void 0, false),\n                    opened: false\n                })\n            ,\n            variants: _animations_ModalManager_animations__WEBPACK_IMPORTED_MODULE_5__.bgAnimation,\n            initial: \"closed\",\n            animate: opened ? 'opened' : 'closed',\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_2__.AnimatePresence, {\n                children: opened && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_2__.motion.div, {\n                    variants: _animations_ModalManager_animations__WEBPACK_IMPORTED_MODULE_5__.modalAnimation,\n                    initial: \"closed\",\n                    animate: \"opened\",\n                    exit: \"exited\",\n                    onClick: (e)=>e.stopPropagation()\n                    ,\n                    className: \"p-6\",\n                    children: modal\n                }, void 0, false, {\n                    fileName: \"/Users/dhruv/Desktop/sketch-sync-board/modules/modal/components/ModalManager.tsx\",\n                    lineNumber: 44,\n                    columnNumber: 13\n                }, undefined)\n            }, void 0, false, {\n                fileName: \"/Users/dhruv/Desktop/sketch-sync-board/modules/modal/components/ModalManager.tsx\",\n                lineNumber: 42,\n                columnNumber: 9\n            }, undefined)\n        }, void 0, false, {\n            fileName: \"/Users/dhruv/Desktop/sketch-sync-board/modules/modal/components/ModalManager.tsx\",\n            lineNumber: 35,\n            columnNumber: 7\n        }, undefined)\n    }, void 0, false, {\n        fileName: \"/Users/dhruv/Desktop/sketch-sync-board/modules/modal/components/ModalManager.tsx\",\n        lineNumber: 34,\n        columnNumber: 5\n    }, undefined);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ModalManager);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tb2R1bGVzL21vZGFsL2NvbXBvbmVudHMvTW9kYWxNYW5hZ2VyLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBMkM7QUFFWTtBQUNoQjtBQUUwQjtBQUtuQjtBQUNFO0FBRWhELEtBQUssQ0FBQ1MsWUFBWSxPQUFTLENBQUM7SUFDMUIsS0FBSyxFQUFFLENBQUMsQ0FBQ0MsTUFBTSxHQUFFQyxLQUFLLEVBQUMsQ0FBQyxFQUFFQyxRQUFRLElBQUlSLHNEQUFjLENBQUNJLHlEQUFTO0lBRTlELEtBQUssTUFBRUssVUFBVSxNQUFFQyxhQUFhLE1BQUliLCtDQUFRO0lBRTVDRCxnREFBUyxLQUFPLENBQUM7UUFDZixFQUFFLEdBQUdhLFVBQVUsRUFBRSxDQUFDO1lBQ2hCLEtBQUssQ0FBQ0UsSUFBSSxHQUFHQyxRQUFRLENBQUNDLGNBQWMsQ0FBQyxDQUFRO1lBQzdDLEVBQUUsRUFBRUYsSUFBSSxFQUFFRCxhQUFhLENBQUNDLElBQUksQ0FBQyxDQUFDO1lBQzlCLE1BQU07UUFDUixDQUFDO1FBRUQsRUFBRSxFQUFFTCxNQUFNLEVBQUUsQ0FBQztZQUNYRyxVQUFVLENBQUNLLEtBQUssQ0FBQ0MsYUFBYSxHQUFHLENBQUssS0FBQztRQUN6QyxDQUFDLE1BQU0sQ0FBQztZQUNOTixVQUFVLENBQUNLLEtBQUssQ0FBQ0MsYUFBYSxHQUFHLENBQU0sTUFBQztRQUMxQyxDQUFDO0lBQ0gsQ0FBQyxFQUFFLENBQUNUO1FBQUFBLE1BQU07UUFBRUcsVUFBVTtJQUFBLENBQUMsQ0FBQyxDQUFDO0lBRXpCLE1BQU0sNkVBQ0hSLG1GQUFNOzhGQUNKRixxREFBVTtZQUNUa0IsU0FBUyxFQUFDLENBQThFO1lBQ3hGQyxPQUFPLE1BQVFWLFFBQVEsQ0FBQyxDQUFDO29CQUFDRCxLQUFLO29CQUFTRCxNQUFNLEVBQUUsS0FBSztnQkFBQyxDQUFDOztZQUN2RGEsUUFBUSxFQUFFakIsNEVBQVc7WUFDckJrQixPQUFPLEVBQUMsQ0FBUTtZQUNoQkMsT0FBTyxFQUFFZixNQUFNLEdBQUcsQ0FBUSxVQUFHLENBQVE7a0dBRXBDUiwwREFBZTswQkFDYlEsTUFBTSxnRkFDSlAscURBQVU7b0JBQ1RvQixRQUFRLEVBQUVoQiwrRUFBYztvQkFDeEJpQixPQUFPLEVBQUMsQ0FBUTtvQkFDaEJDLE9BQU8sRUFBQyxDQUFRO29CQUNoQkMsSUFBSSxFQUFDLENBQVE7b0JBQ2JKLE9BQU8sR0FBR0ssQ0FBQyxHQUFLQSxDQUFDLENBQUNDLGVBQWU7O29CQUNqQ1AsU0FBUyxFQUFDLENBQUs7OEJBRWRWLEtBQUs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQU9wQixDQUFDO0FBRUQsaUVBQWVGLFlBQVksRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL3NrZXRjaC1zeW5jLy4vbW9kdWxlcy9tb2RhbC9jb21wb25lbnRzL01vZGFsTWFuYWdlci50c3g/YWQ4OSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBBbmltYXRlUHJlc2VuY2UsIG1vdGlvbiB9IGZyb20gJ2ZyYW1lci1tb3Rpb24nO1xuaW1wb3J0IHsgdXNlUmVjb2lsU3RhdGUgfSBmcm9tICdyZWNvaWwnO1xuXG5pbXBvcnQgUG9ydGFsIGZyb20gJ0AvY29tbW9uL2NvbXBvbmVudHMvcG9ydGFsL2NvbXBvbmVudHMvUG9ydGFsJztcblxuaW1wb3J0IHtcbiAgYmdBbmltYXRpb24sXG4gIG1vZGFsQW5pbWF0aW9uLFxufSBmcm9tICcuLi9hbmltYXRpb25zL01vZGFsTWFuYWdlci5hbmltYXRpb25zJztcbmltcG9ydCB7IG1vZGFsQXRvbSB9IGZyb20gJy4uL3JlY29pbC9tb2RhbC5hdG9tJztcblxuY29uc3QgTW9kYWxNYW5hZ2VyID0gKCkgPT4ge1xuICBjb25zdCBbeyBvcGVuZWQsIG1vZGFsIH0sIHNldE1vZGFsXSA9IHVzZVJlY29pbFN0YXRlKG1vZGFsQXRvbSk7XG5cbiAgY29uc3QgW3BvcnRhbE5vZGUsIHNldFBvcnRhbE5vZGVdID0gdXNlU3RhdGU8SFRNTEVsZW1lbnQ+KCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXBvcnRhbE5vZGUpIHtcbiAgICAgIGNvbnN0IG5vZGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncG9ydGFsJyk7XG4gICAgICBpZiAobm9kZSkgc2V0UG9ydGFsTm9kZShub2RlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAob3BlbmVkKSB7XG4gICAgICBwb3J0YWxOb2RlLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnYWxsJztcbiAgICB9IGVsc2Uge1xuICAgICAgcG9ydGFsTm9kZS5zdHlsZS5wb2ludGVyRXZlbnRzID0gJ25vbmUnO1xuICAgIH1cbiAgfSwgW29wZW5lZCwgcG9ydGFsTm9kZV0pO1xuXG4gIHJldHVybiAoXG4gICAgPFBvcnRhbD5cbiAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIHotNDAgZmxleCBtaW4taC1mdWxsIHctZnVsbCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgYmctYmxhY2svODBcIlxuICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRNb2RhbCh7IG1vZGFsOiA8PjwvPiwgb3BlbmVkOiBmYWxzZSB9KX1cbiAgICAgICAgdmFyaWFudHM9e2JnQW5pbWF0aW9ufVxuICAgICAgICBpbml0aWFsPVwiY2xvc2VkXCJcbiAgICAgICAgYW5pbWF0ZT17b3BlbmVkID8gJ29wZW5lZCcgOiAnY2xvc2VkJ31cbiAgICAgID5cbiAgICAgICAgPEFuaW1hdGVQcmVzZW5jZT5cbiAgICAgICAgICB7b3BlbmVkICYmIChcbiAgICAgICAgICAgIDxtb3Rpb24uZGl2XG4gICAgICAgICAgICAgIHZhcmlhbnRzPXttb2RhbEFuaW1hdGlvbn1cbiAgICAgICAgICAgICAgaW5pdGlhbD1cImNsb3NlZFwiXG4gICAgICAgICAgICAgIGFuaW1hdGU9XCJvcGVuZWRcIlxuICAgICAgICAgICAgICBleGl0PVwiZXhpdGVkXCJcbiAgICAgICAgICAgICAgb25DbGljaz17KGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKCl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInAtNlwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgIHttb2RhbH1cbiAgICAgICAgICAgIDwvbW90aW9uLmRpdj5cbiAgICAgICAgICApfVxuICAgICAgICA8L0FuaW1hdGVQcmVzZW5jZT5cbiAgICAgIDwvbW90aW9uLmRpdj5cbiAgICA8L1BvcnRhbD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE1vZGFsTWFuYWdlcjtcbiJdLCJuYW1lcyI6WyJ1c2VFZmZlY3QiLCJ1c2VTdGF0ZSIsIkFuaW1hdGVQcmVzZW5jZSIsIm1vdGlvbiIsInVzZVJlY29pbFN0YXRlIiwiUG9ydGFsIiwiYmdBbmltYXRpb24iLCJtb2RhbEFuaW1hdGlvbiIsIm1vZGFsQXRvbSIsIk1vZGFsTWFuYWdlciIsIm9wZW5lZCIsIm1vZGFsIiwic2V0TW9kYWwiLCJwb3J0YWxOb2RlIiwic2V0UG9ydGFsTm9kZSIsIm5vZGUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic3R5bGUiLCJwb2ludGVyRXZlbnRzIiwiZGl2IiwiY2xhc3NOYW1lIiwib25DbGljayIsInZhcmlhbnRzIiwiaW5pdGlhbCIsImFuaW1hdGUiLCJleGl0IiwiZSIsInN0b3BQcm9wYWdhdGlvbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./modules/modal/components/ModalManager.tsx\n");

/***/ }),

/***/ "./modules/modal/index.ts":
/*!********************************!*\
  !*** ./modules/modal/index.ts ***!
  \********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"ModalManager\": () => (/* reexport safe */ _components_ModalManager__WEBPACK_IMPORTED_MODULE_0__[\"default\"]),\n/* harmony export */   \"useModal\": () => (/* reexport safe */ _recoil_modal_hooks__WEBPACK_IMPORTED_MODULE_1__.useModal)\n/* harmony export */ });\n/* harmony import */ var _components_ModalManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/ModalManager */ \"./modules/modal/components/ModalManager.tsx\");\n/* harmony import */ var _recoil_modal_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./recoil/modal.hooks */ \"./modules/modal/recoil/modal.hooks.tsx\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_components_ModalManager__WEBPACK_IMPORTED_MODULE_0__]);\n_components_ModalManager__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tb2R1bGVzL21vZGFsL2luZGV4LnRzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBb0Q7QUFDTDtBQUViIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2tldGNoLXN5bmMvLi9tb2R1bGVzL21vZGFsL2luZGV4LnRzPzEwYTgiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1vZGFsTWFuYWdlciBmcm9tICcuL2NvbXBvbmVudHMvTW9kYWxNYW5hZ2VyJztcbmltcG9ydCB7IHVzZU1vZGFsIH0gZnJvbSAnLi9yZWNvaWwvbW9kYWwuaG9va3MnO1xuXG5leHBvcnQgeyBNb2RhbE1hbmFnZXIsIHVzZU1vZGFsIH07XG4iXSwibmFtZXMiOlsiTW9kYWxNYW5hZ2VyIiwidXNlTW9kYWwiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./modules/modal/index.ts\n");

/***/ }),

/***/ "./modules/modal/recoil/modal.atom.tsx":
/*!*********************************************!*\
  !*** ./modules/modal/recoil/modal.atom.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"modalAtom\": () => (/* binding */ modalAtom)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! recoil */ \"recoil\");\n/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(recoil__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst modalAtom = (0,recoil__WEBPACK_IMPORTED_MODULE_1__.atom)({\n    key: 'modal',\n    default: {\n        modal: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {}, void 0, false),\n        opened: false\n    }\n});\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tb2R1bGVzL21vZGFsL3JlY29pbC9tb2RhbC5hdG9tLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBNkI7QUFFdEIsS0FBSyxDQUFDQyxTQUFTLEdBQUdELDRDQUFJLENBRzFCLENBQUM7SUFDRkUsR0FBRyxFQUFFLENBQU87SUFDWkMsT0FBTyxFQUFFLENBQUM7UUFDUkMsS0FBSztRQUNMQyxNQUFNLEVBQUUsS0FBSztJQUNmLENBQUM7QUFDSCxDQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2tldGNoLXN5bmMvLi9tb2R1bGVzL21vZGFsL3JlY29pbC9tb2RhbC5hdG9tLnRzeD9jNDEwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGF0b20gfSBmcm9tICdyZWNvaWwnO1xuXG5leHBvcnQgY29uc3QgbW9kYWxBdG9tID0gYXRvbTx7XG4gIG1vZGFsOiBKU1guRWxlbWVudCB8IEpTWC5FbGVtZW50W107XG4gIG9wZW5lZDogYm9vbGVhbjtcbn0+KHtcbiAga2V5OiAnbW9kYWwnLFxuICBkZWZhdWx0OiB7XG4gICAgbW9kYWw6IDw+PC8+LFxuICAgIG9wZW5lZDogZmFsc2UsXG4gIH0sXG59KTtcbiJdLCJuYW1lcyI6WyJhdG9tIiwibW9kYWxBdG9tIiwia2V5IiwiZGVmYXVsdCIsIm1vZGFsIiwib3BlbmVkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./modules/modal/recoil/modal.atom.tsx\n");

/***/ }),

/***/ "./modules/modal/recoil/modal.hooks.tsx":
/*!**********************************************!*\
  !*** ./modules/modal/recoil/modal.hooks.tsx ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"useModal\": () => (/* binding */ useModal)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! recoil */ \"recoil\");\n/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(recoil__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _modal_atom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./modal.atom */ \"./modules/modal/recoil/modal.atom.tsx\");\n\n\n\nconst useModal = ()=>{\n    const setModal = (0,recoil__WEBPACK_IMPORTED_MODULE_1__.useSetRecoilState)(_modal_atom__WEBPACK_IMPORTED_MODULE_2__.modalAtom);\n    const openModal = (modal)=>setModal({\n            modal,\n            opened: true\n        })\n    ;\n    const closeModal = ()=>setModal({\n            modal: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {}, void 0, false),\n            opened: false\n        })\n    ;\n    return {\n        openModal,\n        closeModal\n    };\n};\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9tb2R1bGVzL21vZGFsL3JlY29pbC9tb2RhbC5ob29rcy50c3guanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUEwQztBQUVGO0FBRXhDLEtBQUssQ0FBQ0UsUUFBUSxPQUFTLENBQUM7SUFDdEIsS0FBSyxDQUFDQyxRQUFRLEdBQUdILHlEQUFpQixDQUFDQyxrREFBUztJQUU1QyxLQUFLLENBQUNHLFNBQVMsSUFBSUMsS0FBa0MsR0FDbkRGLFFBQVEsQ0FBQyxDQUFDO1lBQUNFLEtBQUs7WUFBRUMsTUFBTSxFQUFFLElBQUk7UUFBQyxDQUFDOztJQUVsQyxLQUFLLENBQUNDLFVBQVUsT0FBU0osUUFBUSxDQUFDLENBQUM7WUFBQ0UsS0FBSztZQUFTQyxNQUFNLEVBQUUsS0FBSztRQUFDLENBQUM7O0lBRWpFLE1BQU0sQ0FBQyxDQUFDO1FBQUNGLFNBQVM7UUFBRUcsVUFBVTtJQUFDLENBQUM7QUFDbEMsQ0FBQztBQUVtQiIsInNvdXJjZXMiOlsid2VicGFjazovL3NrZXRjaC1zeW5jLy4vbW9kdWxlcy9tb2RhbC9yZWNvaWwvbW9kYWwuaG9va3MudHN4P2NlMTUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlU2V0UmVjb2lsU3RhdGUgfSBmcm9tICdyZWNvaWwnO1xuXG5pbXBvcnQgeyBtb2RhbEF0b20gfSBmcm9tICcuL21vZGFsLmF0b20nO1xuXG5jb25zdCB1c2VNb2RhbCA9ICgpID0+IHtcbiAgY29uc3Qgc2V0TW9kYWwgPSB1c2VTZXRSZWNvaWxTdGF0ZShtb2RhbEF0b20pO1xuXG4gIGNvbnN0IG9wZW5Nb2RhbCA9IChtb2RhbDogSlNYLkVsZW1lbnQgfCBKU1guRWxlbWVudFtdKSA9PlxuICAgIHNldE1vZGFsKHsgbW9kYWwsIG9wZW5lZDogdHJ1ZSB9KTtcblxuICBjb25zdCBjbG9zZU1vZGFsID0gKCkgPT4gc2V0TW9kYWwoeyBtb2RhbDogPD48Lz4sIG9wZW5lZDogZmFsc2UgfSk7XG5cbiAgcmV0dXJuIHsgb3Blbk1vZGFsLCBjbG9zZU1vZGFsIH07XG59O1xuXG5leHBvcnQgeyB1c2VNb2RhbCB9O1xuIl0sIm5hbWVzIjpbInVzZVNldFJlY29pbFN0YXRlIiwibW9kYWxBdG9tIiwidXNlTW9kYWwiLCJzZXRNb2RhbCIsIm9wZW5Nb2RhbCIsIm1vZGFsIiwib3BlbmVkIiwiY2xvc2VNb2RhbCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./modules/modal/recoil/modal.hooks.tsx\n");

/***/ }),

/***/ "./pages/_app.tsx":
/*!************************!*\
  !*** ./pages/_app.tsx ***!
  \************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _common_styles_global_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/styles/global.css */ \"./common/styles/global.css\");\n/* harmony import */ var _common_styles_global_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_common_styles_global_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var framer_motion__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! framer-motion */ \"framer-motion\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var react_toastify__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react-toastify */ \"react-toastify\");\n/* harmony import */ var react_toastify__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_toastify__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! recoil */ \"recoil\");\n/* harmony import */ var recoil__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(recoil__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _common_constants_easings__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/common/constants/easings */ \"./common/constants/easings.ts\");\n/* harmony import */ var _modules_modal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @/modules/modal */ \"./modules/modal/index.ts\");\n/* harmony import */ var react_toastify_dist_ReactToastify_min_css__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! react-toastify/dist/ReactToastify.min.css */ \"./node_modules/react-toastify/dist/ReactToastify.min.css\");\n/* harmony import */ var react_toastify_dist_ReactToastify_min_css__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(react_toastify_dist_ReactToastify_min_css__WEBPACK_IMPORTED_MODULE_8__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([framer_motion__WEBPACK_IMPORTED_MODULE_2__, _modules_modal__WEBPACK_IMPORTED_MODULE_7__]);\n([framer_motion__WEBPACK_IMPORTED_MODULE_2__, _modules_modal__WEBPACK_IMPORTED_MODULE_7__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n\n\n\n\n\n\n\n\n\nconst App = ({ Component , pageProps  })=>{\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_head__WEBPACK_IMPORTED_MODULE_3___default()), {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"title\", {\n                        children: \"SketchSync\"\n                    }, void 0, false, {\n                        fileName: \"/Users/dhruv/Desktop/sketch-sync-board/pages/_app.tsx\",\n                        lineNumber: 17,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"link\", {\n                        rel: \"icon\",\n                        href: \"/favicon.ico\"\n                    }, void 0, false, {\n                        fileName: \"/Users/dhruv/Desktop/sketch-sync-board/pages/_app.tsx\",\n                        lineNumber: 18,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/dhruv/Desktop/sketch-sync-board/pages/_app.tsx\",\n                lineNumber: 16,\n                columnNumber: 7\n            }, undefined),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(recoil__WEBPACK_IMPORTED_MODULE_5__.RecoilRoot, {\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_toastify__WEBPACK_IMPORTED_MODULE_4__.ToastContainer, {}, void 0, false, {\n                        fileName: \"/Users/dhruv/Desktop/sketch-sync-board/pages/_app.tsx\",\n                        lineNumber: 21,\n                        columnNumber: 9\n                    }, undefined),\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(framer_motion__WEBPACK_IMPORTED_MODULE_2__.MotionConfig, {\n                        transition: {\n                            ease: _common_constants_easings__WEBPACK_IMPORTED_MODULE_6__.DEFAULT_EASE\n                        },\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_modules_modal__WEBPACK_IMPORTED_MODULE_7__.ModalManager, {}, void 0, false, {\n                                fileName: \"/Users/dhruv/Desktop/sketch-sync-board/pages/_app.tsx\",\n                                lineNumber: 23,\n                                columnNumber: 11\n                            }, undefined),\n                            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                                ...pageProps\n                            }, void 0, false, {\n                                fileName: \"/Users/dhruv/Desktop/sketch-sync-board/pages/_app.tsx\",\n                                lineNumber: 24,\n                                columnNumber: 11\n                            }, undefined)\n                        ]\n                    }, void 0, true, {\n                        fileName: \"/Users/dhruv/Desktop/sketch-sync-board/pages/_app.tsx\",\n                        lineNumber: 22,\n                        columnNumber: 9\n                    }, undefined)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/dhruv/Desktop/sketch-sync-board/pages/_app.tsx\",\n                lineNumber: 20,\n                columnNumber: 7\n            }, undefined)\n        ]\n    }, void 0, true);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFvQztBQUNRO0FBRWhCO0FBQ21CO0FBQ1o7QUFFc0I7QUFDWDtBQUVJO0FBRWxELEtBQUssQ0FBQ00sR0FBRyxJQUFJLENBQUMsQ0FBQ0MsU0FBUyxHQUFFQyxTQUFTLEVBQVcsQ0FBQyxHQUFLLENBQUM7SUFDbkQsTUFBTTs7d0ZBRURQLGtEQUFJOztnR0FDRlEsQ0FBSztrQ0FBQyxDQUFVOzs7Ozs7Z0dBQ2hCQyxDQUFJO3dCQUFDQyxHQUFHLEVBQUMsQ0FBTTt3QkFBQ0MsSUFBSSxFQUFDLENBQWM7Ozs7Ozs7Ozs7Ozt3RkFFckNULDhDQUFVOztnR0FDUkQsMERBQWM7Ozs7O2dHQUNkRix1REFBWTt3QkFBQ2EsVUFBVSxFQUFFLENBQUM7NEJBQUNDLElBQUksRUFBRVYsbUVBQVk7d0JBQUMsQ0FBQzs7d0dBQzdDQyx3REFBWTs7Ozs7d0dBQ1pFLFNBQVM7bUNBQUtDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBS2xDLENBQUM7QUFFRCxpRUFBZUYsR0FBRyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2tldGNoLXN5bmMvLi9wYWdlcy9fYXBwLnRzeD8yZmJlIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi4vY29tbW9uL3N0eWxlcy9nbG9iYWwuY3NzJztcbmltcG9ydCB7IE1vdGlvbkNvbmZpZyB9IGZyb20gJ2ZyYW1lci1tb3Rpb24nO1xuaW1wb3J0IHR5cGUgeyBBcHBQcm9wcyB9IGZyb20gJ25leHQvYXBwJztcbmltcG9ydCBIZWFkIGZyb20gJ25leHQvaGVhZCc7XG5pbXBvcnQgeyBUb2FzdENvbnRhaW5lciB9IGZyb20gJ3JlYWN0LXRvYXN0aWZ5JztcbmltcG9ydCB7IFJlY29pbFJvb3QgfSBmcm9tICdyZWNvaWwnO1xuXG5pbXBvcnQgeyBERUZBVUxUX0VBU0UgfSBmcm9tICdAL2NvbW1vbi9jb25zdGFudHMvZWFzaW5ncyc7XG5pbXBvcnQgeyBNb2RhbE1hbmFnZXIgfSBmcm9tICdAL21vZHVsZXMvbW9kYWwnO1xuXG5pbXBvcnQgJ3JlYWN0LXRvYXN0aWZ5L2Rpc3QvUmVhY3RUb2FzdGlmeS5taW4uY3NzJztcblxuY29uc3QgQXBwID0gKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfTogQXBwUHJvcHMpID0+IHtcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPEhlYWQ+XG4gICAgICAgIDx0aXRsZT5Ta2V0Y2hTeW5jPC90aXRsZT5cbiAgICAgICAgPGxpbmsgcmVsPVwiaWNvblwiIGhyZWY9XCIvZmF2aWNvbi5pY29cIiAvPlxuICAgICAgPC9IZWFkPlxuICAgICAgPFJlY29pbFJvb3Q+XG4gICAgICAgIDxUb2FzdENvbnRhaW5lciAvPlxuICAgICAgICA8TW90aW9uQ29uZmlnIHRyYW5zaXRpb249e3sgZWFzZTogREVGQVVMVF9FQVNFIH19PlxuICAgICAgICAgIDxNb2RhbE1hbmFnZXIgLz5cbiAgICAgICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgICAgIDwvTW90aW9uQ29uZmlnPlxuICAgICAgPC9SZWNvaWxSb290PlxuICAgIDwvPlxuICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgQXBwO1xuIl0sIm5hbWVzIjpbIk1vdGlvbkNvbmZpZyIsIkhlYWQiLCJUb2FzdENvbnRhaW5lciIsIlJlY29pbFJvb3QiLCJERUZBVUxUX0VBU0UiLCJNb2RhbE1hbmFnZXIiLCJBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJ0aXRsZSIsImxpbmsiLCJyZWwiLCJocmVmIiwidHJhbnNpdGlvbiIsImVhc2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.tsx\n");

/***/ }),

/***/ "./common/styles/global.css":
/*!**********************************!*\
  !*** ./common/styles/global.css ***!
  \**********************************/
/***/ (() => {



/***/ }),

/***/ "./node_modules/react-toastify/dist/ReactToastify.min.css":
/*!****************************************************************!*\
  !*** ./node_modules/react-toastify/dist/ReactToastify.min.css ***!
  \****************************************************************/
/***/ (() => {



/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react-toastify":
/*!*********************************!*\
  !*** external "react-toastify" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-toastify");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "recoil":
/*!*************************!*\
  !*** external "recoil" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("recoil");

/***/ }),

/***/ "framer-motion":
/*!********************************!*\
  !*** external "framer-motion" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = import("framer-motion");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.tsx"));
module.exports = __webpack_exports__;

})();